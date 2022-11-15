
import axios from "axios"
import * as React from "react"
import { useEffect } from "react"
import { Dimensions, StyleSheet, Text, View,Button, ScrollView, PermissionsAndroid } from "react-native"
import {Platform,Linking,AppState} from 'react-native';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import MapView, { Callout, Circle, Marker } from "react-native-maps"
import IO from "socket.io-client";
// import Geolocation from 'react-native-geolocation-service'r
import { useState } from "react"
import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import * as TaskManager from 'expo-task-manager';
import { AsyncStorage } from 'react-native';
import * as Notification from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Map from "./Map";

const TASK_FETCH_LOCATION = 'background-location-task';
const SERVER_URL="http://10.0.0.11:4000";

const USERID="636e2d0ef2f834ae0407f1f5"
const socket = IO(SERVER_URL, {
});






export default function App() {

  
  

	return (
		<View style={{ marginTop: 50, flex: 1 }}>
        
			<Map socket={socket}></Map>
     
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center"
	},
	map: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height/2
	}
})