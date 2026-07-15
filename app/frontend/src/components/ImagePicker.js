import React from 'react';
import { ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';

const MAX_IMAGES = 20;

// Horizontal strip of TMDB images (posters or backdrops) to pick from.
// props: images [{file_path}], selected (file_path), onSelect(file_path), aspect 'poster'|'backdrop'
const ImagePicker = (props) => {
  const isBackdrop = props.aspect === 'backdrop';
  const width = isBackdrop ? 220 : 110;
  const images = (props.images || []).slice(0, MAX_IMAGES);

  if (images.length === 0) {
    return <p className='text-foreground/40 text-sm'>No images available.</p>
  }

  return (
    <ScrollShadow orientation="horizontal" className="w-full">
      <div className="flex gap-3 pb-2">
        {images.map(img => {
          const isSelected = props.selected === img.file_path;
          return (
            <button
              key={img.file_path}
              type="button"
              onClick={() => props.onSelect(img.file_path)}
              className={
                "relative flex-shrink-0 rounded-medium overflow-hidden border-2 transition-all " +
                (isSelected
                  ? "border-primary shadow-marquee"
                  : "border-white/10 opacity-60 hover:opacity-100")
              }
              style={{width: width}}
            >
              <img
                src={"https://image.tmdb.org/t/p/" + (isBackdrop ? "w500" : "w342") + img.file_path}
                className="w-full h-full object-cover block"
                alt=""
                loading="lazy"
              />
              {
                isSelected ?
                <div className='absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5'>
                  <Icon icon="solar:check-circle-bold" className='text-primary-foreground' height={16} />
                </div>
                : null
              }
            </button>
          )
        })}
      </div>
    </ScrollShadow>
  )
}

export default ImagePicker
