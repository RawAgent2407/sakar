/**
 * Project page specific data and content
 */

export const projectPageContent = {
  statusBadge: 'TOP PROJECT IN AHM',
  ctaButtons: {
    contactDeveloper: 'Contact Developer',
    viewGallery: 'View Gallery'
  },
  metaLabels: {
    apartments: 'Apartments'
  }
};

export const projectHeroStyles = {
  container: 'relative h-[700px]  md:h-[750px] w-full',
  background: 'absolute inset-0',
  contentContainer: 'relative z-10 h-full flex items-center justify-center',
  contentWrapper: 'w-full',
  glassCard: 'p-6 md:p-8 max-w-4xl mx-4',
  statusBadge: 'bg-[#E50914] text-white text-sm font-medium px-3 py-1 rounded-full inline-flex items-center mb-6',
  title: 'text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] break-words',
  metaContainer: 'flex flex-wrap items-center text-white/90 gap-4 md:gap-8 mb-8',
  metaItem: 'flex items-center',
  buttonContainer: 'flex flex-col sm:flex-row gap-4',
  primaryButton: 'bg-[#E50914] hover:bg-[#f12b35] text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base text-center sm:text-left',
  secondaryButton: 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-colors text-sm sm:text-base'
};

// Background styles that are used in the component
const backgroundStyles = {
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundBlendMode: 'overlay',
  borderRadius: '0px',
  backdropFilter: 'blur(4px)'
} as const;

export { backgroundStyles };
