import React, {Component} from "react";
import {StyleSheet, View} from "react-native";
import Mapbox from "@mapbox/react-native-mapbox-gl";
import GeoJSONExample from "../stores/example.json";

Mapbox.setAccessToken(
    "pk.eyJ1IjoidmFzMTQiLCJhIjoiY2plamRydmd2MG13aDJ4bjVqaTRxM2s5ZSJ9.64Y4d23DX9LC41sP2Njh4Q"
);

const ANNOTATION_SIZE = 30;
const MapZoomLevel = 0.5;

export default MapboxComponent = (props) => {

    // const points = props.annotation.length < 1 ? [] : props.annotation;
    //console.warn('---', props.annotation)

    const renderAnnotations = () => {
        // let points = [
        //   [12.66027728324324324, 55.70990866027728324324324],
        //   [10.599892, 57.762346],
        //   [32.642459, 29.513891],
        //   [95.294367, 5.754341],
        //   [104.302106, 1.359844],
        //   [139.865011, -89.495792]
        // ];
         points = props.annotation;
        const items = [];
        for (let i = 0; i < points.length; i++) {
            const id = `pointAnnotation${i}`;
            //return
            items.push(
                <Mapbox.PointAnnotation key={id} id={id} coordinate={points[i]}>
                    <View style={styles.annotationContainer}>
                        <View style={styles.annotationFill}/>
                    </View>
                    {/*<Mapbox.Callout title="Look! An annotation!"/>*/}
                </Mapbox.PointAnnotation>
            );
        }
        return items;
    };

    return (
        <Mapbox.MapView
            styleURL={Mapbox.StyleURL.Street}
            zoomLevel={MapZoomLevel}
            rotateEnabled={false}
            centerCoordinate=  {props.annotation.length > 0 ?  props.annotation[0] : [104,40] }//{[104, 40]}
            style={styles.container}
        >
            {renderAnnotations()}
            <Mapbox.ShapeSource id="test" shape={props.featureCollection}>
                <Mapbox.LineLayer id="smileyFaceFill" style={layerStyles.smileyFace}/>
            </Mapbox.ShapeSource>
        </Mapbox.MapView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    annotationContainer: {
        width: ANNOTATION_SIZE,
        height: ANNOTATION_SIZE,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderRadius: ANNOTATION_SIZE / 2
        // borderWidth: StyleSheet.hairlineWidth,
        // borderColor: 'rgba(0, 0, 0, 0.45)',
    },
    annotationFill: {
        width: ANNOTATION_SIZE - 10,
        height: ANNOTATION_SIZE - 10,
        borderRadius: (ANNOTATION_SIZE - 10) / 2,
        backgroundColor: "rgba(13, 100, 179, 0.9)",
        transform: [{scale: 0.6}]
    }
});

const layerStyles = Mapbox.StyleSheet.create({
    smileyFace: {
        lineColor: "rgba(13, 100, 179, 0.9)",
        lineWidth: 2
    }
});
