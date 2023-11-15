<template>
<div class="datepicker" tabindex="0" @blur="initShowPopup(false)">
    <!--<input type="text" tabindex="0" class="form-control" @click="initShowPopup"/>-->
    <div class="datepicker__input" @click="initShowPopup">{{ selectedDate }}</div>
    <div v-if="showPopup" class="datepicker__popup">
        <div class="header">
            <div class="header__arrow" @click="handleArrowMonth(e,'next')"> &lt;</div>
            <div class="header__month">{{ currentDateHeader }}</div>
            <div class="header__arrow" @click="handleArrowMonth(e,'pre')">></div>
        </div>
        <div class="content">
            <div class="content__header">
                <div class="box">Sun</div>
                <div class="box">Mon</div>
                <div class="box">Tue</div>
                <div class="box">Wed</div>
                <div class="box">Thu</div>
                <div class="box">Fri</div>
                <div class="box">Sat</div>
            </div>
            <div class="days">
                <div v-for="(row,index) in dayArr" :key="index" class="days__row">
                    <div v-for="(cel, id) in row"
                         @click="handleSelectDay(cel)"
                         :key="id"
                         class="box"
                         :class="{ ' box--active': cel.active, ' box--disable': cel.disable }">
                        {{ cel.text }}
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

</template>

<script>

import {ref} from "vue";

export default {
    name: 'VDatepicker',

    props: {
        min: {
            type: Date,
            default: new Date(2023,11,10)
        },
        max: {
            type: Date,
            default: new Date(2023,11,25)
        },
        year: {
            type: Number,
            default: new Date().getFullYear(),
            required: true
        },
        month: {
            type: Number,
            default: new Date().getMonth() + 1,
            required: true
        }
    },

    emits: [],

    methods: {
        //....
    },

    mounted() {
        this.initDatepicker();
    },
    setup(props, {emit}) {
        let dayArr = ref([]);
        let currentDateHeader = ref('0');
        let month = ref(props.month);
        let year = ref(props.year);
        let showPopup = ref(false);
        let selectedDate = ref(new Date().toLocaleString('en-us', {year: "numeric", month: "numeric", day: "numeric"}));
        let min = ref(props.min);
        let max = ref(props.max);


        // خروجی لازم برای سطرها و ستون های تقویم رو آماده میکنه(در قالب یک آرایه دو بعدی)
        const initDatepicker = function () {
            const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const _date = new Date(year.value, month.value, 0);
            let monthNumber = month.value;
            let yearNumber = _date.getFullYear();
            let monthDays = _date.getDate();
            let firstDay = new Date(year.value, month.value, 1);
            let firstDayName = firstDay.toString().split(' ')[0];
            let firstDayIndex = WEEK_DAYS.indexOf(firstDayName);
            const totalDays = monthDays + firstDayIndex;
            const maxRows = Math.ceil(totalDays / WEEK_DAYS.length);
            let date = new Date();
            let currentDay = date.getDate();
            let day = 1;
            const _dayArr = [];
            currentDateHeader.value = `${new Date(year.value, month.value, 0).toLocaleString('default', {month: 'short'})}
            ${new Date(year.value, month.value, 0).toLocaleString('default', {year: 'numeric'})}`


            for (let i = 1; i <= maxRows; i++) {
                _dayArr.push([]);
                for (let j = 1; j <= WEEK_DAYS.length; j++) {
                    let _day = day - firstDayIndex;
                    if (day <= totalDays && day > firstDayIndex) {
                        _dayArr[i - 1].push({
                            id: _day,
                            text: _day.toString(),
                            active: (_day === currentDay),
                            disable: (new Date(yearNumber, monthNumber, _day) >= min.value && new Date(yearNumber, monthNumber, _day) <= max.value),
                            month: monthNumber,
                            year: yearNumber,
                        });
                    }
                    if (day > totalDays || day <= firstDayIndex) {
                        _dayArr[i - 1].push({
                            id: null,
                            text: '',
                            disable: false
                        });
                    }
                    day++;
                }
            }
            dayArr.value = _dayArr;
        };

        // ایونت های ماه قبل و ماه بعد رو هندل میکنه
        const handleArrowMonth = function (e, type) {
            switch (type) {
                case 'next':
                    month.value += 1;
                    initDatepicker();
                    break;
                case 'pre':
                    month.value -= 1;
                    initDatepicker()
                    break
            }
        }

        // ایونت های ماه قبل و ماه بعد رو هندل میکنه
        const initShowPopup = function (state = true) {
            showPopup.value = state;
        }

        // ایونت انتخاب تاریخ رو هندل میکنه
        const handleSelectDay = function (cel = null) {
            if (!cel.disable && cel.id) {
                showPopup.value = false;
                selectedDate.value = `${cel?.month}/${cel?.text}/${cel?.year}`;
                emit('selectDate', selectedDate.value);
            }
        }

        return {
            currentDateHeader,
            selectedDate,
            showPopup,
            dayArr,
            // month,
            // year,
            // min,
            // max,
            handleArrowMonth,
            handleSelectDay,
            initDatepicker,
            initShowPopup
        };
    }
}
</script>
