// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const loadingOverlay = document.getElementById('loading-overlay');
    const mainContent = document.getElementById('main-content');
    const gallery = document.querySelector('.gallery');
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = modal.querySelector('.modal-close');
    const modalPrevBtn = modal.querySelector('.modal-prev');
    const modalNextBtn = modal.querySelector('.modal-next');

    // --- State Variables ---
    let currentModalIndex = -1; // Index of the currently open item in the modal
    let galleryItems = []; // To store references to gallery item elements for animation

    // --- File List ---
    // Ensure this list is accurate and files are in the correct relative path
    const files = [
      "20250406_130501.jpg", 
      "20250406_214458.jpg", "IMG-20250407-WA0008.jpg", "IMG-20250407-WA0012.jpg",
	  "20250407_125103.jpg", "Screenshot_20250406_194002_BeReal.png", 
      "IMG-20250407-WA0014.jpg", "IMG-20250407-WA0011.jpg", "IMG-20250407-WA0017_1.jpg",
      "20250406_103133.jpg", "20250406_162607.mp4", "20250406_095806.mp4",
      "20250406_124632.jpg", "20250406_132731.jpg", "20250406_222015.mp4",
      "20250406_113106.jpg", "20250406_114409.jpg", "IMG-20250407-WA0001.jpg",
      "IMG-20250407-WA0010.jpg", "20250406_122507(0).jpg", "20250406_122507.jpg",
      "20250406_124738.jpg", "20250406_105644.jpg", "20250406_111202.jpg",
      "IMG-20250407-WA0017.jpg", "IMG-20250407-WA0034.jpg", "20250406_113105.jpg",
      "20250406_113106(0).jpg", "20250406_114357.jpg", "20250406_114402.jpg",
      "20250406_104408.jpg", "20250406_105416.jpg", "20250406_105643.jpg",
      "20250406_105647.jpg", "20250406_113049.jpg", "20250406_103119.jpg",
      "20250406_105259.jpg", "20250406_105417.jpg", "20250406_105419.jpg",
      "20250406_105533.jpg", "20250406_103152.jpg", "20250406_104150.jpg",
      "20250406_104356.jpg", "20250406_104406.jpg", "20250406_105642.jpg",
      "20250407_063327.mp4", "20250406_095854.jpg", "20250406_100240.jpg",
      "20250406_100342.jpg", "20250406_101211.jpg", "20250406_101212.jpg",
      "20250406_103117.jpg", "20250406_105307.jpg", "20250406_201836.jpg",
      "20250406_125908.jpg", "20250406_151516.jpg", "20250406_115624.mp4",
      "20250407_091710.jpg", "20250406_190240.mp4", "20250407_110047.jpg",
      "20250406_151301.mp4", "20250406_214510.jpg", "20250407_124842.jpg",
      "20250407_125057.jpg", "VID-20250407-WA0043.mp4", "VID-20250407-WA0152.mp4",
      "20250406_163845.mp4", "20250407_083327.jpg", "20250407_091812.mp4",
      "VID-20250407-WA0042.mp4", "20250407_121742.mp4", "20250406_105253.jpg",
      "20250406_151517.jpg", "20250406_163724.mp4", "20250406_163901.jpg",
      "20250406_103131.jpg", "20250406_122506.jpg", "20250406_152024.jpg",
      "20250407_085733.jpg", "20250406_094556.mp4", "20250406_180741.mp4",
      "20250406_110310.jpg", "20250406_215222.mp4", "20250406_105258.jpg",
      "20250406_105637.jpg", "20250406_124634.jpg", "20250406_125016(0).jpg",
      "20250406_151517(0).jpg", "20250406_160552(0).jpg", "20250406_224740.jpg",
      "20250407_083315.jpg"
    ];

    // --- Check if essential elements exist ---
    if (!loadingOverlay || !mainContent || !gallery || !modal || !modalContent || !modalClose || !modalPrevBtn || !modalNextBtn) {
        console.error("Essential DOM elements not found! Check IDs and classes.");
        // Optionally display an error message to the user
        if(loadingOverlay) loadingOverlay.textContent = "Error loading page elements.";
        return; // Stop execution
    }

    // --- Function to create and append gallery items ---
    function createGalleryItem(file, index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('gallery-item');
        // Note: Animation delay/trigger is handled after loading now

        const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file);

        // Set a default aspect ratio, updated on media load
        wrapper.style.paddingTop = '100%'; // Default 1:1

        let mediaElement;

        if (isImage) {
            mediaElement = new Image();
            mediaElement.src = file;
            mediaElement.alt = `Gallery item ${index + 1}`; // Descriptive alt text
            mediaElement.loading = 'lazy'; // Lazy load gallery images
            mediaElement.onload = () => updateAspectRatio(wrapper, mediaElement.naturalWidth, mediaElement.naturalHeight);
            mediaElement.onerror = () => handleMediaError(wrapper, file, 'image');
            wrapper.appendChild(mediaElement);
        } else if (isVideo) {
            mediaElement = document.createElement('video');
            mediaElement.src = file;
            mediaElement.preload = 'metadata';
            mediaElement.muted = true;
            mediaElement.playsInline = true;
            mediaElement.onloadedmetadata = () => updateAspectRatio(wrapper, mediaElement.videoWidth, mediaElement.videoHeight);
            mediaElement.onerror = () => handleMediaError(wrapper, file, 'video');
            wrapper.appendChild(mediaElement);

            const playIcon = document.createElement('div');
            playIcon.classList.add('play-icon');
            playIcon.textContent = '▶';
            wrapper.appendChild(playIcon);
        } else {
            console.warn(`Unsupported file type: ${file}`);
            handleMediaError(wrapper, file, 'unsupported');
        }

        // Add click listener to open the modal, passing the index
        if (isImage || isVideo) {
             wrapper.addEventListener('click', () => {
                if (!wrapper.dataset.loadError) { // Don't open modal if error occurred
                     openModal(index);
                }
            });
        }

        gallery.appendChild(wrapper);
        galleryItems.push(wrapper); // Store for later animation
    }

    // --- Helper function to update aspect ratio ---
    function updateAspectRatio(wrapper, width, height) {
        if (height > 0 && width > 0) {
            const aspectRatio = (height / width) * 100;
            wrapper.style.paddingTop = `${aspectRatio}%`;
        } else {
             wrapper.style.paddingTop = '100%'; // Fallback if dimensions are zero
        }
    }

     // --- Helper function to handle media loading errors ---
     function handleMediaError(wrapper, file, type) {
        console.error(`Failed to load ${type}: ${file}`);
        wrapper.style.border = '1px dashed var(--accent-color)';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.style.paddingTop = '0'; // Remove padding if using flex
        wrapper.style.height = '200px'; // Give it a fixed height for error display
        wrapper.innerHTML = `<span style="color: var(--accent-color); font-size: 0.8em; padding: 5px; text-align: center;">${type === 'unsupported' ? 'Unsupported File' : 'Load Error'}</span>`;
        wrapper.dataset.loadError = true; // Mark item as having an error
    }

    // --- Populate the gallery ---
    files.forEach(createGalleryItem);

    // --- Loading Animation Logic ---
    function startLoadingSequence() {
        // Set a timeout for the loading screen duration (e.g., 2 seconds)
        setTimeout(() => {
            // Fade out loading overlay
            loadingOverlay.style.opacity = '0';

            // After fade out transition ends, hide it and show main content
            loadingOverlay.addEventListener('transitionend', () => {
                loadingOverlay.classList.add('hidden'); // Or display: none
                loadingOverlay.style.display = 'none'; // Ensure it's fully hidden

                // Make main content visible and fade it in
                mainContent.classList.remove('content-hidden');

                // Trigger gallery item animations after main content is visible
                // Use a slight delay or transitionend on mainContent if needed
                setTimeout(animateGalleryItems, 100); // Small delay after content starts fading in

            }, { once: true }); // Ensure listener runs only once

        }, 2000); // 2000 milliseconds = 2 seconds
    }

    // --- Function to animate gallery items sequentially ---
    function animateGalleryItems() {
        galleryItems.forEach((item, index) => {
            // Apply staggered delay using setTimeout
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 100); // 100ms delay between each item
        });
    }

    // --- Modal Functionality ---

    // Function to update the content displayed in the modal
    function updateModalContent(index) {
        if (index < 0 || index >= files.length) {
            console.error("Invalid index for modal content:", index);
            closeModal(); // Close if index is out of bounds
            return;
        }

        currentModalIndex = index; // Update the global index
        const file = files[index];
        const isVideo = /\.(mp4|webm|ogg)$/i.test(file);
        const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file);

        // Clear previous content and stop any playing video
        const currentVideo = modalContent.querySelector('video');
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.removeAttribute('src');
            currentVideo.load();
        }
        modalContent.innerHTML = ''; // Clear previous content

        if (isVideo) {
            const videoElement = document.createElement('video');
            videoElement.src = file;
            videoElement.controls = true;
            videoElement.autoplay = true; // Autoplay when navigating
            videoElement.muted = false;
            videoElement.onerror = () => {
                modalContent.innerHTML = `<p style="color: white; text-align: center;">Error loading video.</p>`;
            }
            modalContent.appendChild(videoElement);
        } else if (isImage) {
            const imgElement = new Image();
            imgElement.src = file;
            imgElement.alt = `Modal view: Item ${index + 1}`;
            imgElement.style.cursor = 'zoom-in';
            imgElement.classList.add('modal-media'); // For potential styling
             imgElement.onerror = () => {
                 modalContent.innerHTML = `<p style="color: white; text-align: center;">Error loading image.</p>`;
            }
            modalContent.appendChild(imgElement);

            // Add click listener for zoom toggle
            imgElement.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleZoom(imgElement);
            });
        } else {
             modalContent.innerHTML = `<p style="color: white; text-align: center;">Unsupported file type.</p>`;
        }
    }

    // Function to open the modal at a specific index
    function openModal(index) {
        updateModalContent(index); // Load the content for the given index

        // Show the modal
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10); // Small delay for transition

        // Add listener for background click AFTER modal is potentially visible
        // Use a named function for easier removal
        modal.addEventListener('click', handleModalBackgroundClick);
    }

     // Function to handle clicks on the modal background
    function handleModalBackgroundClick(e) {
        if (e.target === modal) {
            closeModal();
        }
    }

    // Function to close the modal
    function closeModal() {
        // Stop video playback
        const video = modalContent.querySelector('video');
        if (video) {
            video.pause();
            video.removeAttribute('src');
            video.load();
        }

        // Reset zoom
        const zoomedImage = modalContent.querySelector('img.zoomed');
        if (zoomedImage) {
            zoomedImage.classList.remove('zoomed');
            zoomedImage.style.cursor = 'zoom-in';
        }

        // Hide modal with transition
        modal.classList.remove('visible');
        modal.removeEventListener('click', handleModalBackgroundClick); // Remove listener

        // Use transitionend to fully hide and clear content
        let transitionEnded = false;
        const transitionHandler = (e) => {
            if (e.target === modal && e.propertyName === 'opacity' && !transitionEnded) {
                transitionEnded = true;
                modal.classList.add('hidden');
                modalContent.innerHTML = ''; // Clear content
                currentModalIndex = -1; // Reset index
                modal.removeEventListener('transitionend', transitionHandler); // Clean up
            }
        };
        modal.addEventListener('transitionend', transitionHandler);

        // Fallback timeout
        setTimeout(() => {
             if (!transitionEnded) {
                 transitionEnded = true;
                 modal.classList.add('hidden');
                 modalContent.innerHTML = '';
                 currentModalIndex = -1;
                 modal.removeEventListener('transitionend', transitionHandler);
             }
        }, 500); // Match CSS transition duration + buffer
    }

     // Function to toggle zoom state on modal images
    function toggleZoom(imgElement) {
        const isZoomed = imgElement.classList.toggle('zoomed');
        imgElement.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
         // Prevent navigation when zoomed? Optional.
    }

    // --- Navigation Functions ---
    function showPreviousItem() {
        if (files.length === 0) return;
        let newIndex = currentModalIndex - 1;
        if (newIndex < 0) {
            newIndex = files.length - 1; // Wrap around to the last item
        }
        updateModalContent(newIndex);
    }

    function showNextItem() {
        if (files.length === 0) return;
        let newIndex = currentModalIndex + 1;
        if (newIndex >= files.length) {
            newIndex = 0; // Wrap around to the first item
        }
        updateModalContent(newIndex);
    }

    // --- Event Listeners ---

    // Modal Close Button
    modalClose.addEventListener('click', (e) => {
         e.stopPropagation();
         closeModal();
    });

    // Modal Navigation Buttons
    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        showPreviousItem();
    });

    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        showNextItem();
    });

     // Keyboard Navigation (Modal)
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('visible')) { // Only act if modal is open
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                 // Prevent browser scroll if possible
                 e.preventDefault();
                 showPreviousItem();
            } else if (e.key === 'ArrowRight') {
                 // Prevent browser scroll if possible
                 e.preventDefault();
                 showNextItem();
            }
        }
    });

    // --- Initialization ---
    startLoadingSequence(); // Start the loading process

}); // End DOMContentLoaded
