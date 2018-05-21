import { observable, action } from 'mobx';

const ob = observable({
    dataSource:[],
    searchingText:""
});

const setDataSource = action(value => {
    ob.dataSource = value;
});

const setSearchingText = action(value => {
    ob.searchingText = value;
});

var SelectionListStore = {
    ob,
    setDataSource,
    setSearchingText
};

export default SelectionListStore;
