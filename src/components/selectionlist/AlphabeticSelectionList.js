'use strict';

import React, {Component} from 'react';
import {Keyboard, View, Text, StyleSheet} from 'react-native';

import SearchBar from 'antd-mobile/lib/search-bar';
import SelectionListStore from './SelectionListObservable';
import {observer} from "mobx-react";
import FormItem from "../form/FormItem";
import SelectableSectionsListView from "./SelectableSectionsListView";

const cellHeight = 38;
const sectionHeaderHeight = 26;
const separatorHeight = 0.5;

class SectionItem extends Component {
    render() {
        return (
            <Text style={{color: '#3680C6', fontWeight: 'bold'}}>{this.props.title}</Text>
        );
    }
}

const AlphabeticSelectionList = observer(({navigation}) => {

    const textTag = navigation.getParam('textTag');
    const iconTag = navigation.getParam('iconTag');
    const cellItem = navigation.getParam('cellItem');
    const valueTag = navigation.getParam('valueTag');

    const onItemSelected = navigation.getParam('onItemSelected');
    const searchable = navigation.getParam('searchable');
    const searchFunc = navigation.getParam('searchFunc');

    let data = {};
    let sections = [];
    const alphabet = ("abcdefghijklmnopqrstuvwxyz").split("");
    for (let letter of alphabet) {
        let filtered = SelectionListStore.ob.dataSource.filter((item) => {
            return item[textTag].charAt(0).toLowerCase() === letter;
        });
        if (filtered.length === 0) {
            continue;
        }
        let sorted = filtered.sort((a, b) => {
            return ((b[textTag] < a[textTag]) ? 1 : ((b[textTag] > a[textTag]) ? -1 : 0));
        });
        let s = {data: sorted, key: letter.toUpperCase()};
        sections.push(s);
        data[letter.toUpperCase()] = sorted;
    }

    const onItemClicked = (rowData) => {
        onItemSelected(rowData);
        navigation.goBack();
    };

    const onSearch = (value) => {
        SelectionListStore.setSearchingText(value);
        if (typeof searchFunc !== 'undefined') {
            searchFunc(value);
        }
    };

    const onCancel = () => {
        Keyboard.dismiss();
    };

    const renderItem = ({item, index}) => (
        <FormItem
            showLine={false}
            style={{height: cellHeight,}}
            key={index}
            text={item[textTag]}
            value={item[valueTag]}
            // valueStyle={{marginRight: 10}}
            icon={item[iconTag]}
            arrowDirection="none"
            onPress={() => {
                onItemClicked(item);
            }}
        />
    );

    const renderSectionHeader = ({section}) => {
        return (
            <View style={defaultStyle.sectionLayout}>
                <Text style={defaultStyle.sectionText}>{section.key}</Text>
            </View>
        );
    };

    const renderSeparator = () => {
        return (
            <View style={defaultStyle.separator}/>
        );
    };

    return (
        <View style={defaultStyle.parent}>

            {searchable === true && (
                <SearchBar
                    placeholder="Search"
                    cancelText="Cancel"
                    onCancel={onCancel}
                    onChange={onSearch}/>
            )}

            <SelectableSectionsListView
                data={data}
                sections={sections}
                renderItem={renderItem}
                ItemSeparatorComponent={renderSeparator}
                separatorHeight={separatorHeight}
                cellHeight={cellHeight}
                sectionListItem={SectionItem}
                renderSectionHeader={renderSectionHeader}
                sectionHeaderHeight={sectionHeaderHeight} />

        </View>
    );
});

AlphabeticSelectionList.navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title'),
});


const defaultStyle = StyleSheet.create({
    parent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    sectionLayout: {
        backgroundColor: '#ccc',
        height: sectionHeaderHeight
    },
    sectionText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '700',
        fontSize: 16
    },
    separator: {
        backgroundColor: "#ccc",
        height: separatorHeight
    },
});

export default AlphabeticSelectionList;
