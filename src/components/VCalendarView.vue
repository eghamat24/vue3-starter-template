<template>
    <div class="calendar-view">
        <div class="row d-flex flex-fill text-center gx-6 mb-2">
            <div
                v-for="(weekday, index) of weekdays"
                :key="index"
                class="calendar-view__day"
            >
                {{ weekday }}
            </div>
        </div>

        <div class="row d-flex flex-fill text-center gx-6">
            <div
                v-for="index in startDayOfWeek"
                :key="index"
                class="calendar-view__day"
            ></div>

            <div
                v-for="item of daysInMonth"
                :key="item.day"
                :class="dayClassNames(item)"
                class="calendar-view__day cursor-pointer"
            >
                <slot name="day" :item="item">{{ item.day }}</slot>
            </div>
        </div>
    </div>
</template>

<script>
// Vue
import { computed } from 'vue';

// Utils
import DateTime from '@/utils/date-time';

// Constants
import DateTimeConstants from '@/constants/date-time';

export default {
    name: 'VCalendarView',

    props: {
        value: {
            type: Number,
            required: true
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

    setup(props) {
        const date = computed(() => {
            const date = DateTime.make(props.value);

            date.setCalendar(props.calendar);

            return date;
        });

        const today = computed(() => {
            const today = DateTime.today();

            switch (props.calendar) {
                case DateTimeConstants.Jalali:
                    today.jalali();
                    break;

                case DateTimeConstants.Gregorian:
                    today.gregorian();
                    break;

                case DateTimeConstants.Islamic:
                    today.islamic();
                    break;
            }

            return today.startOfDay().getTimestamp();
        });

        const weekdays = computed(() => {
            const weekdays = [];

            const weekday = date.value.clone().startOfWeek();

            for (let index = 0; index < DateTimeConstants.DaysPerWeek; index++) {
                weekdays.push(weekday.format('dddd'));

                weekday.addDay(1);
            }

            return weekdays;
        });

        const startDayOfWeek = computed(() => {
            return date.value.clone().startOfMonth().dayOfWeek();
        });

        const daysInMonth = computed(() => {
            const daysInMonth = [];
            const daysInMonthCount = date.value.clone().endOfMonth().getDay();

            const day = date.value.clone().startOfMonth();

            for (let index = 0; index < daysInMonthCount; index++) {
                const item = {};

                item.timestamp = day.startOfDay().getTimestamp();
                item.day = day.getDay();
                item.isWeekend = day.isWeekend();
                item.isToday = day.startOfDay().getTimestamp() === today.value;

                daysInMonth.push(item);

                day.addDay(1);
            }

            return daysInMonth;
        });

        const dayClassNames = computed(() => {
            return (day) => {
                return [
                    'py-2',

                    {
                        'text-danger': day.isWeekend,
                        'text-primary': day.isToday
                    }
                ];
            };
        });

        return {
            date,

            weekdays,
            startDayOfWeek,
            daysInMonth,
            dayClassNames
        };
    }
};
</script>