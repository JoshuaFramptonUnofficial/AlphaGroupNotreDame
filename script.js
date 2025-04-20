// script.js

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');

    // Check if elements exist
    if (!gallery || !modal || !modalContent || !modalClose) {
        console.error("Essential DOM elements not found!");
        return; // Stop execution if elements are missing
    }

    // Full list of filenames - with specified files removed
    const files = [
      "20250406_094556.mp4",         "20250406_180741.mp4",     
      "20250406_110310.jpg",         "20250406_132720.jpg",
      "20250406_132728.jpg",         "20250406_160551.jpg",
      "20250406_215222.mp4",         "20250406_105258.jpg",
      "20250406_105637.jpg",         "20250406_124634.jpg",
      "20250406_125016(0).jpg",      "20250406_125016.jpg",
      "20250406_132729.jpg",         "20250406_151517(0).jpg",
      "20250406_160552(0).jpg",      "20250406_160552.jpg",
      "20250406_224740.jpg",         "20250407_083315.jpg",
      "Screenshot_20250406_194002_BeReal.png", /*"20250406_125017.jpg", Removed */
      "20250406_125039.jpg",         "20250406_130501.jpg",
      "20250406_132730.jpg",         "20250406_160553.jpg",
      "20250406_214458.jpg",         "20250407_085737.jpg",
      /* "20250406_125014.jpg", Removed */ /* "20250406_125018.jpg", Removed */
      "20250406_103133.jpg",         "20250406_162607.mp4",
	  "20250406_095806.mp4",
      "20250406_124632.jpg",         /* "20250406_125010(0).jpg", Removed */
      "20250406_132731.jpg",         "20250406_222015.mp4",
      "20250406_113106.jpg",         "20250406_114409.jpg",
      "20250406_122507(0).jpg",      "20250406_122507.jpg",
      "20250406_124738.jpg",         /* "20250406_125007.jpg", Removed */
      /* "20250406_125013.jpg", Removed */ /* "20250406_125018(0).jpg", Removed */
      "20250406_105644.jpg",         "20250406_105645.jpg",
      "20250406_105647(0).jpg",      "20250406_111202.jpg",
      "20250406_113105.jpg",         "20250406_113106(0).jpg",
      "20250406_114357.jpg",         "20250406_114402.jpg",
      /* "20250406_125010.jpg", Removed */ "20250406_104408.jpg",
      "20250406_105416.jpg",         "20250406_105614.jpg",
      "20250406_105639.jpg",         "20250406_105643.jpg",
      "20250406_105646.jpg",         "20250406_105647.jpg",
      "20250406_113049.jpg",         /* "20250410_150211.jpg", Removed */
      "20250406_103119.jpg",         "20250406_105259.jpg",
      "20250406_105417.jpg",         "20250406_105419.jpg",
      "20250406_105533.jpg",          /* "20250406_094554 (2).jpg", Removed */
      "20250406_103152.jpg",         "20250406_104150.jpg",
      "20250406_104356.jpg",         "20250406_104404.jpg",
      "20250406_104406.jpg",         "20250406_105327.jpg",
      "20250406_105642.jpg",         "20250407_063327.mp4",
      "20250406_095848.mp4",
      "20250406_095854.jpg",         "20250406_100240.jpg",
      "20250406_100342.jpg",         "20250406_101211.jpg",
      "20250406_101212.jpg",         "20250406_103117.jpg",
      "20250406_104142.jpg",         "20250406_105307.jpg",
      "20250406_201836.jpg",         "file_00000000f0e45230827db54a11d0c407_conversation_id=67f24702-1360-8008-b1d0-862e3d98d3b7&message_id=30ea7d4e-8c34-4fce-946e-e760ba59bb56.PNG",
      /* "20250406_125011.jpg", Removed */ "20250406_125908.jpg",
      "20250406_151516.jpg",         "20250406_160554.jpg",
      "20250406_115624.mp4",
      "20250407_091710.jpg",         
      "20250406_190240.mp4",         "20250406_160553(0).jpg",
      "20250406_230433.mp4",         "20250407_110047.jpg",
      "20250406_151301.mp4",         "20250406_214510.jpg",
      "20250407_124842.jpg",         "20250407_125057.jpg",
      "VID-20250407-WA0043.mp4",     "VID-20250407-WA0152.mp4",
	  "20250406_163845.mp4",
      "20250407_083327.jpg",    /* "20250406_110024.jpg", Removed */
      "20250406_214508.jpg",         "20250407_091812.mp4",
      "VID-20250407-WA0042.mp4",     "20250407_121742.mp4",
      "20250406_105253.jpg",         "20250406_105616.jpg",
      "20250406_130400.jpg",         "20250406_151517.jpg",
      "20250406_163724.mp4",         "20250406_163901.jpg",
      "20250406_180814.mp4",         "20250406_103131.jpg",
      "20250406_122506.jpg",         /* "20250406_125012.jpg", Removed */
      "20250406_152024.jpg",         "20250407_085733.jpg",
    ];

    // Function to create and append gallery items
    function createGalleryItem(file, index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('gallery-item');
        // Stagger animation delay
        wrapper.style.animationDelay = `${index * 100}ms`;

        const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file);

        // Set a default aspect ratio, updated on media load
        wrapper.style.paddingTop = '100%'; // Default 1:1

        let mediaElement;

        if (isImage) {
            mediaElement = new Image();
            mediaElement.src = file;
            mediaElement.alt = file; // Add alt text
            mediaElement.onload = () => {
                // Update aspect ratio based on natural dimensions
                if (mediaElement.naturalHeight > 0) {
                   const aspectRatio = (mediaElement.naturalHeight / mediaElement.naturalWidth) * 100;
                   wrapper.style.paddingTop = `${aspectRatio}%`;
                }
            };
            mediaElement.onerror = () => {
                console.error(`Failed to load image: ${file}`);
                wrapper.style.border = '1px dashed red'; // Indicate load failure
            };
            wrapper.appendChild(mediaElement);
        } else if (isVideo) {
            mediaElement = document.createElement('video');
            mediaElement.src = file;
            mediaElement.preload = 'metadata'; // Load only metadata initially
            mediaElement.muted = true; // Mute preview
            mediaElement.playsInline = true; // Important for mobile

            mediaElement.onloadedmetadata = () => {
                // Update aspect ratio based on video dimensions
                if (mediaElement.videoHeight > 0) {
                   const aspectRatio = (mediaElement.videoHeight / mediaElement.videoWidth) * 100;
                    wrapper.style.paddingTop = `${aspectRatio}%`;
                }
            };
             mediaElement.onerror = () => {
                console.error(`Failed to load video: ${file}`);
                wrapper.style.border = '1px dashed red'; // Indicate load failure
            };
            wrapper.appendChild(mediaElement);

            // Add play icon overlay for videos
            const playIcon = document.createElement('div');
            playIcon.classList.add('play-icon');
            playIcon.textContent = '▶'; // Use text or an SVG/icon font
            wrapper.appendChild(playIcon);
        } else {
            console.warn(`Unsupported file type: ${file}`);
            // Optionally create a placeholder for unsupported files
            const placeholder = document.createElement('div');
            placeholder.textContent = 'Unsupported';
            placeholder.style.textAlign = 'center';
            placeholder.style.padding = '1rem';
            wrapper.appendChild(placeholder);
            wrapper.style.paddingTop = '100%'; // Maintain square aspect ratio
        }

        // Add click listener to the wrapper to open the modal
        wrapper.addEventListener('click', () => {
            if (isImage || isVideo) {
                openModal(file, isVideo);
            }
        });

        gallery.appendChild(wrapper);
    }

    // Populate the gallery
    files.forEach(createGalleryItem);

    // Function to open the modal
    function openModal(src, isVideo) {
        // Clear previous content
        modalContent.innerHTML = '';

        if (isVideo) {
            const videoElement = document.createElement('video');
            videoElement.src = src;
            videoElement.controls = true; // Show native video controls
            videoElement.autoplay = true; // Start playing automatically
            videoElement.muted = false; // Ensure video is not muted in modal
            modalContent.appendChild(videoElement);
        } else {
            const imgElement = new Image();
            imgElement.src = src;
            imgElement.alt = "Enlarged view"; // Accessibility
            imgElement.style.cursor = 'zoom-in'; // Indicate zoom capability
            imgElement.classList.add('modal-media'); // Add class for potential styling/selection
            modalContent.appendChild(imgElement);

             // Add click listener for zoom toggle on the image itself
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent modal close if clicking on image
                toggleZoom(imgElement);
            });
        }

        // Show the modal with transition
        modal.classList.remove('hidden');
        // Use setTimeout to allow the display change to apply before adding class for transition
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10); // Small delay

        // Add listener to close modal on background click
        modal.addEventListener('click', handleModalBackgroundClick);
    }

     // Function to handle clicks on the modal background (to close it)
    function handleModalBackgroundClick(e) {
        // Close only if the click is directly on the modal overlay, not its children
        if (e.target === modal) {
            closeModal();
        }
    }

    // Function to close the modal
    function closeModal() {
        // Stop video/audio playback
        const video = modalContent.querySelector('video');
        if (video) {
            video.pause();
            video.removeAttribute('src'); // Detach source to ensure download stops
            video.load();
        }

         // Remove zoom class if present
        const zoomedImage = modalContent.querySelector('img.zoomed');
        if (zoomedImage) {
            zoomedImage.classList.remove('zoomed');
            zoomedImage.style.cursor = 'zoom-in';
        }

        // Hide modal with transition
        modal.classList.remove('visible');

         // Remove the click listener for the background
        modal.removeEventListener('click', handleModalBackgroundClick);

        // Wait for transition to finish before hiding and clearing content
        modal.addEventListener('transitionend', () => {
            modal.classList.add('hidden');
            modalContent.innerHTML = ''; // Clear content after hidden
        }, { once: true }); // Listener fires only once per close action
    }

     // Function to toggle zoom state on modal images
    function toggleZoom(imgElement) {
        const isZoomed = imgElement.classList.toggle('zoomed');
        imgElement.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
    }


    // Add event listener for the close button
    modalClose.addEventListener('click', (e) => {
         e.stopPropagation(); // Prevent background click handler
         closeModal();
    });

     // Add keyboard accessibility (close modal with Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });

}); // End DOMContentLoaded