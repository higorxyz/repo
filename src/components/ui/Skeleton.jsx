export const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClass = 'animate-pulse bg-gradient-to-r from-purple-500/10 via-purple-500/20 to-purple-500/10 bg-[length:200%_100%] animate-shimmer';
  
  const variants = {
    default: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4',
    title: 'rounded h-8',
    button: 'rounded-lg h-10',
    card: 'rounded-2xl',
  };

  return (
    <div className={`${baseClass} ${variants[variant]} ${className}`} />
  );
};

export const ProjectCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-12 h-12" />
          <Skeleton variant="text" className="w-20" />
        </div>
        <Skeleton variant="button" className="w-20 h-6" />
      </div>

      <Skeleton variant="title" className="w-3/4 mb-3" />
      
      <div className="space-y-2 mb-4 flex-grow">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
        <Skeleton variant="text" className="w-4/6" />
      </div>

      <div className="flex gap-4 mb-4">
        <Skeleton variant="text" className="w-16" />
        <Skeleton variant="text" className="w-16" />
      </div>

      <div className="flex gap-2 mb-4 min-h-[32px]">
        <Skeleton variant="button" className="w-20 h-7" />
        <Skeleton variant="button" className="w-24 h-7" />
        <Skeleton variant="button" className="w-16 h-7" />
      </div>

      <div className="flex gap-2 mt-auto">
        <Skeleton variant="button" className="flex-1" />
        <Skeleton variant="button" className="w-12" />
      </div>
    </div>
  );
};

export const SkillCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-500/30 p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <Skeleton variant="circle" className="w-8 h-8" />
          <div className="space-y-2">
            <Skeleton variant="text" className="w-24" />
            <Skeleton variant="text" className="w-16 h-3" />
          </div>
        </div>
        <Skeleton variant="text" className="w-12" />
      </div>
      <Skeleton variant="default" className="w-full h-3 rounded-full" />
    </div>
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-xl border border-purple-500/30 p-8 rounded-2xl">
      <div className="flex justify-center mb-4">
        <Skeleton variant="circle" className="w-10 h-10" />
      </div>
      <Skeleton variant="title" className="w-20 h-10 mb-2 mx-auto" />
      <Skeleton variant="text" className="w-24 mx-auto" />
    </div>
  );
};
