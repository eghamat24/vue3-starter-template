import { ref, computed } from 'vue';

import PropertyService from '@/services/property.service';

import { useLoading } from '@/composables/loading.composable';

export function useFetchProperties() {
    const { isLoading, startLoading, endLoading } = useLoading();

    const propertiesLoading = computed(() => isLoading.value);
    const properties = ref(null);
    const propertiesKeyById = ref(null);

    function updatePropertiesKeyById() {
        const temp = {};

        for (const property of properties.value) {
            temp[property.id] = property;
        }

        propertiesKeyById.value = temp;
    }

    function fetchProperties() {
        startLoading();

        return PropertyService.getAll()
            .then(function (response) {
                properties.value = response.data.value;
                updatePropertiesKeyById();
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        propertiesLoading,
        properties,
        propertiesKeyById,
        fetchProperties
    };
}

export function useFetchProperty() {
    const { isLoading, startLoading, endLoading } = useLoading();

    const propertyLoading = computed(() => isLoading.value);
    const property = ref(null);

    function fetchPropertyById(id) {
        startLoading();

        return PropertyService.getOneById(id)
            .then(function (response) {
                property.value = response.data.value;
            })
            .finally(function () {
                endLoading();
            });
    }

    return {
        propertyLoading,
        property,
        fetchPropertyById
    };
}
