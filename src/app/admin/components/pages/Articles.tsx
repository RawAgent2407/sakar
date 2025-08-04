import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Plus, X, Edit, Trash2 } from 'lucide-react';

interface ArticleImage {
  url: string;
  name: string;
  data: string;
}

interface Article {
  _id?: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  content: string[];
  images: ArticleImage[];
  featured?: boolean;
  coverImage: ArticleImage;
}

const defaultArticle: Article = {
  title: '',
  author: '',
  date: '',
  readTime: '',
  content: [''],
  images: [],
  featured: false,
  coverImage: { url: '', name: '', data: '' },
};

const ArticlesAdmin: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<Article>(defaultArticle);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => { if (data.success) setArticles(data.articles); });
  }, []);

  const handleInput = (field: keyof Article, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleCoverImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => ({
        ...prev,
        coverImage: { ...prev.coverImage, data: base64, url: '', name: prev.coverImage?.name || '' },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleContentChange = (idx: number, value: string) => {
    setForm(prev => {
      const content = [...prev.content];
      content[idx] = value;
      return { ...prev, content };
    });
  };
  const handleContentAdd = () => setForm(prev => ({ ...prev, content: [...prev.content, ''] }));
  const handleContentRemove = (idx: number) => setForm(prev => {
    const content = [...prev.content];
    content.splice(idx, 1);
    return { ...prev, content };
  });

  const handleImageChange = (idx: number, key: keyof ArticleImage, value: string) => {
    setForm(prev => {
      const images = [...prev.images];
      images[idx] = { ...images[idx], [key]: value };
      return { ...prev, images };
    });
  };
  const handleImageAdd = () => setForm(prev => ({ ...prev, images: [...prev.images, { url: '', name: '', data: '' }] }));
  const handleImageRemove = (idx: number) => setForm(prev => {
    const images = [...prev.images];
    images.splice(idx, 1);
    return { ...prev, images };
  });

  const handleImageFile = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm(prev => {
        const images = [...prev.images];
        images[idx] = { ...images[idx], data: base64, url: '', name: images[idx].name };
        return { ...prev, images };
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    const title = form.title.trim();
    const author = form.author.trim();
    const readTimeNum = parseInt(form.readTime);
    if (!title || title === '.' || /^\.+$/.test(title)) {
      alert('Article title cannot be empty, only spaces, or only dots.');
      return;
    }
    if (!author || author === '.' || /^\.+$/.test(author)) {
      alert('Author name cannot be empty, only spaces, or only dots.');
      return;
    }
    if (isNaN(readTimeNum) || readTimeNum <= 0) {
      alert('Read time must be a positive number.');
      return;
    }
    const method = editingId ? 'PUT' : 'POST';
    const url = '/api/articles';
    const body = editingId ? { ...form, _id: editingId } : form;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      setArticles(editingId
        ? articles.map(a => a._id === editingId ? data.article : a)
        : [data.article, ...articles]);
      setShowForm(false);
      setForm(defaultArticle);
      setEditingId(null);
    }
  };

  const handleEdit = (article: Article) => {
    setForm({
      ...article,
      coverImage: article.coverImage || { url: '', name: '', data: '' },
    });
    setEditingId(article._id || null);
    setShowForm(true);
  };

  const handleDelete = async (_id?: string) => {
    if (!_id) return;
    const res = await fetch('/api/articles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id }),
    });
    const data = await res.json();
    if (data.success) setArticles(articles.filter(a => a._id !== _id));
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white mb-2">Articles</h1>
        <Button variant="primary" icon={Plus} onClick={() => { setShowForm(true); setForm(defaultArticle); setEditingId(null); }}>Add Article</Button>
      </div>
      {showForm && (
        <Card className="mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Article Title" value={form.title} onChange={v => handleInput('title', v)} required />
              <Input label="Author Name" value={form.author} onChange={v => handleInput('author', v)} required />
              <Input label="Date" value={form.date} onChange={v => handleInput('date', v)} required type="date" />
              <Input label="Read Time (e.g. 12 min read)" value={form.readTime} onChange={v => handleInput('readTime', v)} required />
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={e => handleInput('featured', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  id="featured"
                />
                <label htmlFor="featured" className="text-sm text-white">Featured Article</label>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Cover Image</h3>
              <div className="flex items-center space-x-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  style={{ color: 'white' }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleCoverImageFile(file);
                  }}
                />
                {form.coverImage?.data ? (
                  <img src={form.coverImage.data} alt="Cover Preview" className="w-24 h-24 object-cover rounded" />
                ) : form.coverImage?.url ? (
                  <img src={form.coverImage.url} alt="Cover Preview" className="w-24 h-24 object-cover rounded" />
                ) : null}
                <Input placeholder="Name" value={form.coverImage.name} onChange={v => setForm(prev => ({ ...prev, coverImage: { ...prev.coverImage, name: v } }))} />
                {form.coverImage.url && !form.coverImage.data && (
                  <Input placeholder="Image URL" value={form.coverImage.url} onChange={v => setForm(prev => ({ ...prev, coverImage: { ...prev.coverImage, url: v } }))} />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Content Paragraphs</h3>
              {form.content.map((para, idx) => (
                <div key={idx} className="flex items-center space-x-3 mb-2">
                  <textarea
                    placeholder={`Paragraph ${idx + 1}`}
                    value={para}
                    onChange={e => handleContentChange(idx, e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-vertical"
                  />
                  <Button variant="ghost" size="sm" icon={X} onClick={() => handleContentRemove(idx)}>{''}</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" icon={Plus} onClick={handleContentAdd}>{''}</Button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Supporting Images</h3>
              {form.images.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    style={{ color: 'white' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(idx, file);
                    }}
                  />
                  {item.data ? (
                    <img src={item.data} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  ) : item.url ? (
                    <img src={item.url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                  ) : null}
                  <Input placeholder="Name" value={item.name || ''} onChange={v => handleImageChange(idx, 'name', v)} />
                  {item.url && !item.data && (
                    <Input placeholder="Image URL" value={item.url || ''} onChange={v => handleImageChange(idx, 'url', v)} />
                  )}
                  <Button variant="ghost" size="sm" icon={X} onClick={() => handleImageRemove(idx)}>{''}</Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" icon={Plus} onClick={handleImageAdd}>{''}</Button>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <Button variant="secondary" onClick={() => { setShowForm(false); setForm(defaultArticle); setEditingId(null); }}>{'Cancel'}</Button>
              <Button variant="primary" type="submit">{editingId ? 'Update Article' : 'Save Article'}</Button>
            </div>
          </form>
        </Card>
      )}
      <Card>
        <div className="mb-4 flex items-center">
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full max-w-xs"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Title</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Author</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Read Time</th>
                <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.readTime.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((article) => (
                <tr key={article._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4 text-white">{article.title}</td>
                  <td className="py-4 px-4 text-white">{article.author}</td>
                  <td className="py-4 px-4 text-white">{article.date}</td>
                  <td className="py-4 px-4 text-white">{article.readTime}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(article)}>{''}</Button>
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(article._id)}>{''}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ArticlesAdmin; 