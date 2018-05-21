import React from 'react';
import {FlatList, Keyboard, View} from 'react-native';

import SearchBar from 'antd-mobile/lib/search-bar';
import SelectionListStore from './SelectionListObservable';
import {observer} from "mobx-react";
import FormItem from "../form/FormItem";


const SelectionList = observer(({navigation}) => {

    let textTag = navigation.getParam('textTag');
    let onItemSelected = navigation.getParam('onItemSelected');
    let searchable = navigation.getParam('searchable');
    let searchFunc = navigation.getParam('searchFunc');
    let iconTag =  navigation.getParam('iconTag');
    let valueTag =  navigation.getParam('valueTag');

    const onItemClicked = (rowData) => {
        onItemSelected(rowData);
        navigation.goBack();
    };

    const onEndReached = () => {
    };

    const onSearch = (value) => {
        SelectionListStore.setSearchingText(value);
        if (typeof searchFunc !== 'undefined'){
            searchFunc(value);
        }
    };

    const onCancel = () => {
        Keyboard.dismiss();
    };

    return(
        <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems:'stretch'
            }}>
        {searchable === true && <SearchBar
            placeholder="Search"
            cancelText="Cancel"
            onCancel={onCancel}
            onChange={onSearch}
            />
        }
        {SelectionListStore.ob.dataSource !== undefined && SelectionListStore.ob.dataSource.length > 0 &&
            <FlatList
                data={SelectionListStore.ob.dataSource}
                renderItem={({item, index}) =>
            <FormItem
                key={index}
                text={item[textTag]}
                value={item[valueTag]}
                icon={item[iconTag]}
                arrowDirection="none"
                onPress={() => {
                onItemClicked(item);
            }}/>
            }
            keyExtractor={(item, index) => index.toString()}
            onEndReached={() => onEndReached()}
            onEndReachedThreshold={0.5}
             />
        }
        </View>
    );
});

SelectionList.navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title'),
});

export default SelectionList;
