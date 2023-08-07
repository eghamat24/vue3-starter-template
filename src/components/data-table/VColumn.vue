<script>
export default {
    name: 'VColumn',

    props: {
        header: {
            type: String,
            default: null
        },
        field: {
            type: [String, Function],
            default: null
        }
    }
}
</script>
