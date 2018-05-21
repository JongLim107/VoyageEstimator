'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View} from 'react-native';

const returnTrue = () => true;

class MySectionList extends Component {

    constructor(props, context) {
        super(props, context);

        this.lastSelectedIndex = null;
    }

    onSectionSelect = (sectionId, fromTouch) => {
        this.props.onSectionSelect && this.props.onSectionSelect(sectionId);

        if (!fromTouch) {
            this.lastSelectedIndex = null;
        }
    };

    resetSection = () => {
        this.lastSelectedIndex = null;
    };

    detectAndScrollToSection = (e) => {
        const ev = e.nativeEvent.touches[0];
        let targetY = ev.locationY;

        const {y, height} = this.measure;

        if (!y || targetY < y) {
            return;
        }

        let index = Math.floor((targetY - y) / height);
        index = Math.min(index, this.props.sections.length - 1);
        if (this.lastSelectedIndex !== index && this.props.data[this.props.sections[index]].length) {
            this.lastSelectedIndex = index;
            this.onSectionSelect(this.props.sections[index], true);
        }

    };

    // componentDidUpdate(){
    //     const sectionItem = this.refs.sectionItem0;
    //
    //     // this.measureTimer = setTimeout(() => {
    //     //     sectionItem.measure((x, y, width, height, pageX, pageY) => {
    //     //         //console.log([x, y, width, height, pageX, pageY]);
    //     //         this.measure = {
    //     //             y: y,
    //     //             height
    //     //         };
    //     //     })
    //     // }, 0);
    //
    // }

    // componentDidMount() {
    //     const sectionItem = this.refs.sectionItem0;
    //
    //     // this.measureTimer = setTimeout(() => {
    //     //     sectionItem.measure((x, y, width, height, pageX, pageY) => {
    //     //         //console.log([x, y, width, height, pageX, pageY]);
    //     //         this.measure = {
    //     //             y: y,
    //     //             height
    //     //         };
    //     //     })
    //     // }, 0);
    //
    // }

    // componentWillUnmount() {
    //     this.measureTimer && clearTimeout(this.measureTimer);
    // }

    render() {
        const SectionComponent = this.props.component;
        const sections = this.props.sections.map((section, index) => {
            const title = this.props.getSectionListTitle
                ? this.props.getSectionListTitle(section)
                : section;

            const textStyle = this.props.data[section].length
                ? styles.text
                : styles.inactiveText;

            const child = SectionComponent ? (
                <SectionComponent
                    sectionId={section}
                    title={title}
                />
            ) : (
                <View
                    style={styles.item}>
                    <Text style={textStyle}>{title}</Text>
                </View>
            );

            return (
                <View key={index}
                      // ref={'sectionItem' + index}
                      pointerEvents="none"
                      onLayout={(event) => {
                          if (index === 0) {
                              let {y, height} = event.nativeEvent.layout;
                              this.measure = {
                                  y: y,
                                  height,
                              };
                          }
                      }}>
                    {child}
                </View>
            );
        });

        return (
            <View ref="view" style={[styles.container, this.props.style]}
                  onStartShouldSetResponder={returnTrue}
                  onMoveShouldSetResponder={returnTrue}
                  onResponderGrant={this.detectAndScrollToSection}
                  onResponderMove={this.detectAndScrollToSection}
                  onResponderRelease={this.resetSection} >
                {sections}
            </View>
        );
    }
}

MySectionList.propTypes = {

    /**
     * A component to render for each section item
     */
    component: PropTypes.func,

    /**
     * Function to provide a title the section list items.
     */
    getSectionListTitle: PropTypes.func,

    /**
     * Function to be called upon selecting a section list item
     */
    onSectionSelect: PropTypes.func,

    /**
     * The sections to render
     */
    sections: PropTypes.array.isRequired,

    /**
     * A style to apply to the section list container
     */
    style: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
    ])
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 0,
        bottom: 0,
        width: 15
    },

    item: {
        padding: 0
    },

    text: {
        fontWeight: '700',
        color: '#008fff'
    },

    inactiveText: {
        fontWeight: '700',
        color: '#CCCCCC'
    }
});

export default MySectionList;
