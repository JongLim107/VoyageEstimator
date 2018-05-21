'use strict';
/* jshint esnext: true */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import sectionListGetItemLayout from './react-native-section-list-get-item-layout/dist/index'
import MySectionList from "./MySectionList";
import {SectionList, StyleSheet, View} from 'react-native';

class SelectableSectionsListView extends Component {

    constructor(props, context) {
        super(props, context);

        this.getItemLayout = sectionListGetItemLayout({
            // The height of the row with rowData at the given sectionIndex and rowIndex
            getItemHeight: () => this.props.cellHeight,

            // These three properties are optional
            getSeparatorHeight: () => this.props.separatorHeight, // The height of your separators
            getSectionHeaderHeight: () => this.props.sectionHeaderHeight, // The height of your section headers
            getSectionFooterHeight: () => 0, // The height of your section footers
        });
    }

    scrollToSection = (section) => {
        const keys = Object.keys(this.props.data);
        const index = keys.indexOf(section);
        this.refs["sectionList"].scrollToLocation({sectionIndex:index, itemIndex:-1, animated: true});
        this.props.onScrollToSection && this.props.onScrollToSection(section);
    };

    renderFooter = () => {
        const Footer = this.props.footer;
        return <Footer />;
    };

    renderHeader = () => {
        const Header = this.props.header;
        return <Header />;
    };

    onScroll = (e) => {
        const offsetY = e.nativeEvent.contentOffset.y;
        if (this.props.updateScrollState) {
            this.setState({
                offsetY
            });
        }

        this.props.onScroll && this.props.onScroll(e);
    };

    onScrollAnimationEnd = (e) => {
        if (this.props.updateScrollState) {
            this.setState({
                offsetY: e.nativeEvent.contentOffset.y
            });
        }
    };

    render() {
        const sections = this.props.sections;
        const data = this.props.data;

        const dataIsArray = Array.isArray(data);

        let sectionList;
        if (dataIsArray) {
        } else {
            sectionList = !this.props.hideSectionList ? (
                <MySectionList
                    style={this.props.sectionListStyle}
                    onSectionSelect={this.scrollToSection}
                    sections={Object.keys(data)}
                    data={data}
                    // getSectionListTitle={this.props.getSectionListTitle}
                    // component={this.props.sectionListItem}
                />
            ) : null;
        }

        const renderFooter = this.props.footer ?
            this.renderFooter :
            this.props.renderFooter;

        const renderHeader = this.props.header ?
            this.renderHeader :
            this.props.renderHeader;

        const moreProps = {
            onScroll: this.onScroll,
            onScrollAnimationEnd: this.onScrollAnimationEnd,
            data: data,
            sections: sections,
            renderFooter,
            renderHeader,
            renderItem: this.props.renderItem,
        };

        const props = {...this.props, ...moreProps};
        props.style = void 0;

        return (
            <View ref="view" style={[styles.container, this.props.style]}>

                <SectionList
                    ref="sectionList"
                    renderItem={this.props.renderItem}
                    renderSectionHeader={this.props.renderSectionHeader}
                    ItemSeparatorComponent={this.props.ItemSeparatorComponent}
                    sections={this.props.sections}
                    onScrollToIndexFailed={()=>{}}
                    getItemLayout={this.getItemLayout} />

                {sectionList}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

const styleSheetProp = PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
]);

SelectableSectionsListView.propTypes = {
    /**
     * The data to render in the listview
     */
    data: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,

    /**
     * Whether to show the section listing or not
     */
    hideSectionList: PropTypes.bool,

    /**
     * Functions to provide a title for the section header and the section list
     * items. If not provided, the section ids will be used (the keys from the data object)
     */
    getSectionTitle: PropTypes.func,
    getSectionListTitle: PropTypes.func,

    /**
     * Callback which should be called when the user scrolls to a section
     */
    onScrollToSection: PropTypes.func,

    /**
     * A custom element to render for each section list item
     */
    sectionListItem: PropTypes.func,

    /**
     * A custom element to render for each section header
     */
    sectionHeader: PropTypes.func,

    /**
     * A custom element to render as footer
     */
    footer: PropTypes.func,

    /**
     * A custom element to render as header
     */
    header: PropTypes.func,

    /**
     * The height of the header element to render. Is required if a
     * header element is used, so the positions can be calculated correctly
     */
    headerHeight: PropTypes.number,

    /**
     * A custom function to render as footer
     */
    renderHeader: PropTypes.func,

    /**
     * A custom function to render as header
     */
    renderFooter: PropTypes.func,

    /**
     * An object containing additional props, which will be passed
     * to each cell component
     */
    cellProps: PropTypes.object,

    /**
     * The height of the separator
     */
    separatorHeight: PropTypes.number.isRequired,

    /**
     * The height of the section header component
     */
    sectionHeaderHeight: PropTypes.number.isRequired,

    /**
     * The height of the cell component
     */
    cellHeight: PropTypes.number.isRequired,

    /**
     * Whether to determine the y postion to scroll to by calculating header and
     * cell heights or by using the UIManager to measure the position of the
     * destination element. This is an exterimental feature
     */
    useDynamicHeights: PropTypes.bool,

    /**
     * Whether to set the current y offset as state and pass it to each
     * cell during re-rendering
     */
    updateScrollState: PropTypes.bool,

    /**
     * Styles to pass to the container
     */
    style: styleSheetProp,

    /**
     * Styles to pass to the section list container
     */
    sectionListStyle: styleSheetProp

};

export default SelectableSectionsListView;
