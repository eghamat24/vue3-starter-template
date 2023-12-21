<template>
    <div class="date-picker">
        <div class="d-flex mb-4">
            <button
                type="button"
                class="btn btn-sm btn-outline-primary fw-bold ms-auto"
                @click="changeCalendar"
            >
                {{ datePickerCalendar === DateTimeConstants.Jalali ? 'تاریخ میلادی' : 'تاریخ شمسی' }}
            </button>
        </div>

        <div class="date-picker__body">
            <div class="d-flex align-items-center justify-content-between">
                <button
                    v-if="canGoToPrevMonth"
                    type="button"
                    class="btn btn-sm btn-outline-primary date-picker__prev-btn"
                    @click="goToPrevMonth"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 18L15 12L9 6" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>

                <button
                    v-if="canGoToNextMonth"
                    type="button"
                    class="btn btn-sm btn-outline-primary date-picker__next-btn"
                    @click="goToNextMonth"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15 18L9 12L15 6" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>

            <div
                class="date-picker__slider"
                ref="slider"
                :style="`--month-basis: ${monthWidthInPercent}%`"
            >
                <div
                    v-for="month of months"
                    :key="month.timestamp"
                    class="date-picker__month"
                >
                    <div class="subtitle-3 fw-bold text-center mb-4 mb-sm-5">
                        {{ datePickerCalendar === DateTimeConstants.Jalali ? month.jalali : month.gregorian }}
                    </div>

                    <VCalendarView
                        :value="month.timestamp"
                        :calendar="datePickerCalendar"
                    >
                        <template #day="{ item }">
                            <div
                                :class="dayClassNames(item.timestamp)"
                                @click="selectDay(item.timestamp)"
                            >
                                {{ item.day }}
                            </div>
                        </template>
                    </VCalendarView>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// Vue
import { computed, ref } from 'vue';

// Utils
import { executeAfterTransition } from '@/utils/index';
import Breakpoints from '@/utils/breakpoints';
import DateTime from '@/utils/date-time';

// Constants
import DateTimeConstants from '@/constants/date-time';

// Components
import VCalendarView from '@/components/VCalendarView.vue';

export default {
    name: 'VDatePicker',

    components: {
        VCalendarView
    },

    props: {
        modelValue: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            default: null
        },
        max: {
            type: Number,
            default: null
        },
        calendar: {
            type: String,
            default: DateTimeConstants.Jalali,
            validator(value) {
                return [
                    DateTimeConstants.Jalali,
                    DateTimeConstants.Gregorian,
                    DateTimeConstants.Islamic
                ].includes(value);
            }
        }
    },

    emits: ['update:modelValue'],

    setup(props, context) {
        const datePicker = ref();

        function initializePickerDate() {
            const date = DateTime.make(props.modelValue);

            date.setCalendar(props.calendar);

            datePicker.value = date;
        }

        initializePickerDate();

        const datePickerCalendar = computed(() => datePicker.value.calendar());

        const selectedDate = computed(() => {
            const date = DateTime.make(props.modelValue);

            date.setCalendar(props.calendar);

            return date.startOfDay().getTimestamp();
        });

        const dayClassNames = computed(() => {
            return timestamp => {
                const min = props.min ? (props.min - DateTimeConstants.DayInSeconds) : null;

                const selected = (timestamp === selectedDate.value);
                const disabled = (min && timestamp < min) || (props.max && timestamp > props.max);

                return {
                    'bg-primary text-white fw-semibold rounded': selected,
                    'text-decoration-line-through': disabled
                };
            };
        });

        function selectDay(timestamp) {
            context.emit('update:modelValue', timestamp);
        }

        function changeCalendar() {
            if (datePickerCalendar.value === DateTimeConstants.Jalali) {
                datePicker.value.setCalendar(DateTimeConstants.Gregorian);
            } else {
                datePicker.value.setCalendar(DateTimeConstants.Jalali);
            }
        }

        const slider = ref();
        const months = ref([]);

        const monthsPerView = Breakpoints.down(Breakpoints.MD) ? 1 : 2;
        const monthWidthInPercent = 100 / monthsPerView;

        function initializeMonths() {
            const date = datePicker.value.clone();

            for (let index = 0; index < monthsPerView; index++) {
                months.value.push({
                    timestamp: date.getTimestamp(),
                    jalali: date.jalali().format('yyyy MMMM'),
                    gregorian: date.gregorian().format('yyyy MMMM')
                });

                date.addMonth(1);
            }
        }

        initializeMonths();

        const canGoToPrevMonth = computed(() => {
            if (!props.min) {
                return true;
            }

            const prevMonth = datePicker.value.clone().subMonth(1).endOfMonth().getTimestamp();
            return prevMonth > props.min;
        });

        const canGoToNextMonth = computed(() => {
            if (!props.max) {
                return true;
            }

            const nextMonth = datePicker.value.clone().addMonth(monthsPerView).startOfMonth().getTimestamp();
            return nextMonth < props.max;
        });

        function goToPrevMonth() {
            if (!canGoToPrevMonth.value) {
                return;
            }

            const CLASS_NAME_SLIDE = 'date-picker__slider--slide';
            const CLASS_NAME_MOVING = 'date-picker__slider--moving';

            const pervMonth = datePicker.value.clone().subMonth(1);

            slider.value.classList.add(CLASS_NAME_SLIDE);
            months.value.unshift({
                timestamp: pervMonth.getTimestamp(),
                jalali: pervMonth.jalali().format('yyyy MMMM'),
                gregorian: pervMonth.gregorian().format('yyyy MMMM')
            });

            setTimeout(() => {
                slider.value.classList.add(CLASS_NAME_MOVING);
                slider.value.classList.remove(CLASS_NAME_SLIDE);

                executeAfterTransition(() => {
                    slider.value.classList.remove(CLASS_NAME_MOVING);
                    months.value.pop();
                }, slider.value);
            }, 0);

            datePicker.value.subMonth(1);
        }

        function goToNextMonth() {
            if (!canGoToNextMonth.value) {
                return;
            }

            const CLASS_NAME_SLIDE = 'date-picker__slider--slide';
            const CLASS_NAME_MOVING = 'date-picker__slider--moving';

            const nextMonth = datePicker.value.clone().addMonth(monthsPerView);

            months.value.push({
                timestamp: nextMonth.getTimestamp(),
                jalali: nextMonth.jalali().format('yyyy MMMM'),
                gregorian: nextMonth.gregorian().format('yyyy MMMM')
            });
            slider.value.classList.add(CLASS_NAME_SLIDE, CLASS_NAME_MOVING);

            executeAfterTransition(() => {
                slider.value.classList.remove(CLASS_NAME_SLIDE, CLASS_NAME_MOVING);
                months.value.shift();
            }, slider.value);

            datePicker.value.addMonth(1);
        }

        return {
            datePicker,
            slider,

            datePickerCalendar,
            dayClassNames,
            selectDay,
            changeCalendar,

            months,
            monthWidthInPercent,
            canGoToPrevMonth,
            canGoToNextMonth,
            goToPrevMonth,
            goToNextMonth,

            DateTimeConstants
        };
    }
};
</script>
