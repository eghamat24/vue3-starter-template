const SCREEN_WIDTH = window.screen.width;
const BreakpointsWidth = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
};

function getBreakpointNext(name) {
    switch (name) {
        case Breakpoints.XS:
            return Breakpoints.SM;
        case Breakpoints.SM:
            return Breakpoints.MD;
        case Breakpoints.MD:
            return Breakpoints.LG;
        case Breakpoints.LG:
            return Breakpoints.XL;
        case Breakpoints.XL:
            return null;
    }
}

const Breakpoints = {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',

    /**
     * @param {('xs'|'sm'|'md'|'lg'|'xl')} name - Breakpoint name
     * @returns {boolean}
     */
    up(name) {
        if (!BreakpointsWidth[name]) {
            throw new TypeError(`BREAKPOINTS: Parameter "name" provided value "${name}" but expected values "xs|sm|md|lg|xl".`);
        }

        return SCREEN_WIDTH >= BreakpointsWidth[name];
    },

    /**
     * @param {('xs'|'sm'|'md'|'lg'|'xl')} name - Breakpoint name
     * @returns {boolean}
     */
    down(name) {
        if (!BreakpointsWidth[name]) {
            throw new TypeError(`BREAKPOINTS: Parameter "name" provided value "${name}" but expected values "xs|sm|md|lg|xl".`);
        }

        return SCREEN_WIDTH < BreakpointsWidth[name];
    },

    /**
     * @param {('xs'|'sm'|'md'|'lg'|'xl')} from - Breakpoint name
     * @param {('xs'|'sm'|'md'|'lg'|'xl')} to - Breakpoint name
     * @returns {boolean}
     */
    between(from, to) {
        return Breakpoints.up(from) && Breakpoints.down(to);
    },

    /**
     * @param {('xs'|'sm'|'md'|'lg'|'xl')} name - Breakpoint name
     * @returns {boolean}
     */
    only(name) {
        const next = getBreakpointNext(name);

        if (!next) {
            return Breakpoints.up(name);
        }

        return Breakpoints.between(name, next);
    },

    /**
     * @returns {boolean}
     */
    isMobile() {
        return Breakpoints.down('md');
    }
};

export default Breakpoints;
