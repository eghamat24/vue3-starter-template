<template>
    <div class="container p-3">
        <gallery-slider :images="images" v-model="selectedIndex" />

        <gallery-slider-thumbnails :images="thumbnailImages" v-model="selectedIndex"/>
    </div>
</template>

<script>
// Vue
import { ref, watch } from "vue";

// Components
import GallerySlider from "@/components/gallery-slider/GallerySlider.vue";
import GallerySliderThumbnails from "@/components/gallery-slider/GallerySliderThumbnails.vue";

export default {
    components: {
        GallerySliderThumbnails,
        GallerySlider
    },

    setup() {

        const selectedIndex = ref(0);

        const images = [
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-44.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-90.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-82.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-84.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-47.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-28.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-46.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-48.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-18.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-14.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-06.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-19.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-23.jpg',
        ];
        const thumbnailImages = [
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-44.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-90.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-82.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-84.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-47.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-28.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-46.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-48.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-18.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-14.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-06.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-19.jpg',
            'https://www.eghamat24.com/app/public/hotel_images/original/Mashhad-Darvishi-23.jpg',
        ];

        watch(() => selectedIndex.value, (value) => {
            selectedIndex.value = value;
        });

        return {
            images,
            thumbnailImages,

            selectedIndex
        }
    }
}
</script>
