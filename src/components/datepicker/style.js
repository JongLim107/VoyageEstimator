import {StyleSheet} from 'react-native';

let style = StyleSheet.create({
    dateTouch: {},
    dateTouchBody: {
        backgroundColor: '#ffffff',
        marginBottom: 0,
        marginLeft: 8
    },
    dateContent: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderBottomColor: '#c8cfd4',
        borderBottomWidth: 1,
        alignContent: 'flex-start'
    },
    dateLabel: {
        marginTop: 8,
        marginBottom: 4,
        marginLeft: 0,
        marginRight: 0,
        color: '#9ca6b0',
        fontSize: 17,
        fontWeight: 'bold'
    },
    dateIcon: {
        width: 32,
        height: 32,
        marginLeft: 5,
        marginRight: 5
    },
    dateInput: {
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    dateText: {
        color: '#333',
        fontSize: 17
    },
    placeholderText: {
        color: '#c9c9c9'
    },
    datePickerMask: {
        flex: 1,
        alignItems: 'flex-end',
        flexDirection: 'row',
        backgroundColor: '#00000077'
    },
    datePickerCon: {
        backgroundColor: '#fff',
        height: 0,
        overflow: 'hidden'
    },
    btnText: {
        position: 'absolute',
        top: 0,
        height: 42,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnTextText: {
        fontSize: 16,
        color: '#46cf98'
    },
    btnTextCancel: {
        color: '#666'
    },
    btnCancel: {
        left: 0
    },
    btnConfirm: {
        right: 0
    },
    datePicker: {
        marginTop: 42,
        borderTopColor: '#ccc',
        borderTopWidth: 1
    },
    disabled: {
        backgroundColor: '#eee'
    }
});

export default style;