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

    // Updated list of filenames, extracted from the paths provided
    const files = [
      "20250407_125103.jpg",
      "Screenshot_20250406_194002_BeReal.png",
      "20250406_130501.jpg",
      "20250406_214458.jpg",
      "20250407_085737.jpg",
      "20250406_103133.jpg",
      "20250406_162607.mp4",
      "20250406_095806.mp4",
      "20250406_124632.jpg",
      "20250406_132731.jpg",
      "20250406_222015.mp4",
      "20250406_113106.jpg",
      "20250406_114409.jpg",
      "20250406_122507(0).jpg",
      "20250406_122507.jpg",
      "20250406_124738.jpg",
      "20250406_105644.jpg",
      "20250406_111202.jpg",
      "20250406_113105.jpg",
      "20250406_113106(0).jpg",
      "20250406_114357.jpg",
      "20250406_114402.jpg",
      "20250406_104408.jpg",
      "20250406_105416.jpg",
      "20250406_105643.jpg",
      "20250406_105647.jpg",
      "20250406_113049.jpg",
      "20250406_103119.jpg",
      "20250406_105259.jpg",
      "20250406_105417.jpg",
      "20250406_105419.jpg",
      "20250406_105533.jpg",
      "20250406_103152.jpg",
      "20250406_104150.jpg",
      "20250406_104356.jpg",
      "20250406_104406.jpg",
      "20250406_105327.jpg",
      "20250406_105642.jpg",
      "20250407_063327.mp4",
      "20250406_095854.jpg",
      "20250406_100240.jpg",
      "20250406_100342.jpg",
      "20250406_101211.jpg",
      "20250406_101212.jpg",
      "20250406_103117.jpg",
      "20250406_105307.jpg",
      "20250406_201836.jpg",
      "20250406_125908.jpg",
      "20250406_151516.jpg",
      "20250406_115624.mp4",
      "20250407_091710.jpg",
      "20250406_190240.mp4",
      "20250407_110047.jpg",
      "20250406_151301.mp4",
      "20250406_214510.jpg",
      "20250407_124842.jpg",
      "20250407_125057.jpg",
      "VID-20250407-WA0043.mp4",
      "VID-20250407-WA0152.mp4",
      "20250406_163845.mp4",
      "20250407_083327.jpg",
      "20250407_091812.mp4",
      "VID-20250407-WA0042.mp4",
      "20250407_121742.mp4",
      "20250406_105253.jpg",
      "20250406_151517.jpg",
      "20250406_163724.mp4",
      "20250406_163901.jpg",
      "20250406_103131.jpg",
      "20250406_122506.jpg",
      "20250406_152024.jpg",
      "20250407_085733.jpg",
      "20250406_094556.mp4",
      "20250406_180741.mp4",
      "20250406_110310.jpg",
      "20250406_215222.mp4",
      "20250406_105258.jpg",
      "20250406_105637.jpg",
      "20250406_124634.jpg",
      "20250406_125016(0).jpg",
      "20250406_151517(0).jpg",
      "20250406_160552(0).jpg",
      "20250406_224740.jpg",
      "20250407_083315.jpg"
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
            mediaElement.src = file; // Use just the filename
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
                // Add visual indication of load failure
                wrapper.style.border = '1px dashed #e53935'; // Use accent color
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                wrapper.innerHTML = `<span style="color: #e53935; font-size: 0.8em; padding: 5px;">Load Error</span>`;
            };
            wrapper.appendChild(mediaElement);
        } else if (isVideo) {
            mediaElement = document.createElement('video');
            mediaElement.src = file; // Use just the filename
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
                 // Add visual indication of load failure
                wrapper.style.border = '1px dashed #e53935'; // Use accent color
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.justifyContent = 'center';
                wrapper.innerHTML = `<span style="color: #e53935; font-size: 0.8em; padding: 5px;">Load Error</span>`;
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
        // Only add listener if the media element was successfully created (isImage or isVideo)
        if (isImage || isVideo) {
             wrapper.addEventListener('click', () => {
                // Check if the item has an error state before opening modal
                if (!wrapper.querySelector('span')) { // Don't open modal if error span exists
                     openModal(file, isVideo);
                }
            });
        }


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
            videoElement.src = src; // Use just the filename
            videoElement.controls = true; // Show native video controls
            videoElement.autoplay = true; // Start playing automatically
            videoElement.muted = false; // Ensure video is not muted in modal
            videoElement.onerror = () => {
                modalContent.innerHTML = `<p style="color: white; text-align: center;">Error loading video.</p>`;
            }
            modalContent.appendChild(videoElement);
        } else {
            const imgElement = new Image();
            imgElement.src = src; // Use just the filename
            imgElement.alt = "Enlarged view"; // Accessibility
            imgElement.style.cursor = 'zoom-in'; // Indicate zoom capability
            imgElement.classList.add('modal-media'); // Add class for potential styling/selection
            imgElement.onerror = () => {
                 modalContent.innerHTML = `<p style="color: white; text-align: center;">Error loading image.</p>`;
            }
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
        // Use a flag to prevent multiple triggers if transitionend fires multiple times
        let transitionEnded = false;
        modal.addEventListener('transitionend', function handler(e) {
            // Ensure it's the opacity transition ending on the modal itself
            if (e.target === modal && e.propertyName === 'opacity' && !transitionEnded) {
                transitionEnded = true;
                modal.classList.add('hidden');
                modalContent.innerHTML = ''; // Clear content after hidden
                modal.removeEventListener('transitionend', handler); // Clean up listener
            }
        });

        // Fallback timeout in case transitionend doesn't fire (e.g., transition disabled)
        setTimeout(() => {
             if (!transitionEnded) {
                 transitionEnded = true;
                 modal.classList.add('hidden');
                 modalContent.innerHTML = '';
                 // Ensure listener is removed if timeout fires first
                 modal.removeEventListener('transitionend', modal.transitionEndHandler);
             }
        }, 500); // Match transition duration + buffer

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
