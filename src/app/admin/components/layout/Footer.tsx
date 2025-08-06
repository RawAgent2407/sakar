import React from 'react';
import { Button } from '../common/Button';
import { Save, Eye, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <footer className="h-16 bg-black border-t border-gray-800 px-6 flex items-center justify-end space-x-4">
      {/* Removed Save Draft and Publish buttons */}
      <Button variant="ghost" size="sm" icon={Eye} onClick={() => router.push('/') }>
        Preview
      </Button>
    </footer>
  );
};