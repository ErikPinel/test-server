
import axios from "axios"
import * as React from "react"
import { useEffect } from "react"
import { Dimensions, StyleSheet, Text, View,Button, ScrollView, PermissionsAndroid, Alert } from "react-native"
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
import { useRef } from "react";
import * as Application from 'expo-application';

const TASK_FETCH_LOCATION = 'background-location-task';
const SERVER_URL="http://10.0.0.11:4000";

const USERID="636e2d0ef2f834ae0407f1f5"
console.log(Application.applicationId)


Notification.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true
    };
  }
});













// async ()=>
// {
//   console.log("a")
//   const isLocationAut=await AsyncStorage.getItem('locationAuthInitial');
//   if(isLocationAut!="true")


// 3 when you're done, stop it
// Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
//   if (value) {
//     Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
//   }
// });
// const register = (pushToken) => axios.post('/expoPushTokens', { token: pushToken });


async function registerForPushNotificationsAsync() {
    let token;
  
    const { status: existingStatus } = await Notification.getPermissionsAsync();
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
        const { status } = await Notification.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }
    token = (await Notification.getExpoPushTokenAsync()).data;
    console.log(token+"%%%%%%%%%%%%%%%%%%%%%%%%");
  
    await AsyncStorage.setItem("NotificationToken",`${token}`)
  

    alert(await AsyncStorage.getItem("NotificationToken"))




  }

  



export default function Map({socket}) {
     
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const responseListener = useRef();

  let counter=0;
  const[myLocatin,setMyLocation]=useState({
		latitude: 32.07962,
		longitude: 34.88911
	})



	const [ pin, setPin ] = React.useState({
		latitude: 32.07962,
		longitude: 34.88911
	})
  
	const [ region, setRegion ] = React.useState({
		latitude: 32.07962,
		longitude: 34.88911,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421
	})
  const [ baseLocations, setBaseLocations ] = React.useState([])


 





  


  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((statusObj) => {
        if (statusObj.status !== 'granted') {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return statusObj;
      }).then(statusObj => {
        if (statusObj.status !== 'granted') {
          alert('Notifications will be unavailable now');
          return;
        }
      });
  

    //   socket.on('disTo', (msg) =>{ msg<75? triggerNotification() :"",console.log(counter)});*******
  }, []);
  useEffect(()=> {

    responseListener.current = Notification.addNotificationResponseReceivedListener(response => {
        console.log('--- notification tapped ---');
        console.log(response);
        console.log('------');
    });

 
  socket.emit('join')


  TaskManager.defineTask(TASK_FETCH_LOCATION, async ({ data: { locations }, error }) => {
    const id="636e2d0ef2f834ae0407f1f5"
    const token= await AsyncStorage.getItem("NotificationToken")
    if (error) {
      console.error(error);
      return;
    }
   
    const [location] = locations;
    try {
      const url = SERVER_URL+"/users/parent/currentLocation";
    //   socket.emit('disOn', location,USERID)// you should use post instead of get to persist data on the backend
    axios.patch(SERVER_URL+"/users/parent/pushNotification",{id:id,token:token,location:location})
      console.log(location.coords.latitude)
      setMyLocation({latitude:location.coords.latitude,longitude:location.coords.longitude})
    } catch (err) {
      console.error(err);
    }
  });

  },[socket])





//   useEffect(() => {
//     //When app is closed
//     const backgroundSubscription = Notification.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });
//     //When the app is open
//     const foregroundSubscription = Notification.addNotificationReceivedListener(notification => {
//       console.log(notification);
//     });

//     return () => {
//       backgroundSubscription.remove();
//       foregroundSubscription.remove();
//     }
//   }, []);







   function removeItemValue() {
    try {
       
          Location.hasStartedLocationUpdatesAsync(TASK_FETCH_LOCATION).then((value) => {
          if (value) {
            Location.stopLocationUpdatesAsync(TASK_FETCH_LOCATION);
          }
        });
        return true;
    }
    catch(exception) {
        return false;
    }
}


const triggerNotification = () => {
console.log("niro erik is in place")

  Notification.scheduleNotificationAsync({
    content: {
      title: "findmyKId",
      body: "kid is in location"
    },
    trigger: {
      seconds: 2
    }
  });
}




function startBack(){// 2 start the task
Location.startLocationUpdatesAsync(TASK_FETCH_LOCATION, {
  accuracy: Location.Accuracy.Highest,
  distanceInterval: 10, // minimum change (in meters) betweens updates
  deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
 
  // foregroundService is how you get the task to be updated as often as would be if the app was open
  foregroundService: {
    notificationTitle: 'Using your location',
    notificationBody: 'To turn off, go back to the app and switch something off.',
  },
}); console.log("home")}

  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
   
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
       
        return;
      }
      AsyncStorage.setItem(
        'locationAuthInitial',
        'true.'
      );
      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude);
      setLocation(location.coords);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
//////////////////////register
 
 






  useEffect(() => {
    const id="636e2d0ef2f834ae0407f1f5"
   
    // const backgroundSubscription = Notification.addNotificationResponseReceivedListener(response => {
    //     console.log(response);
    //   });

      axios.post(SERVER_URL+"/users/parent/getBaseLocations",{id:id})
       
       .then((data) => 
       
        { setBaseLocations(data.data)
         
        }
       ).catch(error => console.log(error));
 }, []); 




  const handleAddPlace=()=>{
    const id="636e2d0ef2f834ae0407f1f5"

  let newLocationsBaseArray=[...baseLocations];
  newLocationsBaseArray.push(pin)
  console.log("sa"+newLocationsBaseArray[0].latitude)
  
 
  setBaseLocations(newLocationsBaseArray)
   axios.patch(SERVER_URL+"/users/parent/addBaseLocations",{id:id,newLocationsBaseArray:newLocationsBaseArray})
  .then(data=>console.log(data+"sss")) .catch(error => console.log(error));

 }





























	return (
		<View style={{ marginTop: 50, flex: 1 }}>
    
			<GooglePlacesAutocomplete
				placeholder="Search"
				fetchDetails={true}
				GooglePlacesSearchQuery={{
					rankby: "distance"
				}}
				onPress={(data, details = null) => {
					// 'details' is provided when fetchDetails = true
					console.log(data, details)
					setRegion({
						latitude: details.geometry.location.lat,
						longitude: details.geometry.location.lng,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					})
				}}
				query={{
					// key: "AIzaSyDJheGFKSCMaY62ohf_eld0gq171hcY0F4",
          key: "none",
					language: "iw",
					components: "country:il",
					types: "address",
					radius: 100,
					location: `${region.latitude}, ${region.longitude}`
				}}
				// styles={{
				// 	container: { flex: 0, position: "relative", width: "100%", zIndex: 1 },
				// 	listView: { backgroundColor: "white" }
				// }}
       
        minLength={2}
        autoFocus={false}
        returnKeyType={'default'}
       
        styles={{
           	container: { flex: 0, position: "relative", width: "100%", zIndex: 1},
          textInputContainer: {
            backgroundColor: '#d3d3d3',
          },
          textInput: {
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          }
        }}
			/>
			<MapView
				style={styles.map}
				initialRegion={{
          latitude: 32.07962,
          longitude: 34.88911,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421
				}}
				provider="google"
			>
	
  <Marker coordinate={myLocatin} >

<Callout>
    <Text>location</Text>
  </Callout>
</Marker>


				<Marker
					coordinate={pin}
					pinColor="black"
					draggable={true}
					onDragStart={(e) => {
						console.log("Drag start", e.nativeEvent.coordinate)
					}}
					onDragEnd={(e) => {
						setPin({
							latitude: e.nativeEvent.coordinate.latitude,
							longitude: e.nativeEvent.coordinate.longitude
						})
					}}
				>







					<Callout>
						<Text>I'm here</Text>
					</Callout>
				</Marker>
				<Circle center={myLocatin} radius={35} />

       


        {baseLocations.map((marker, index) => (
          <>
    <Marker
      key={index}
      coordinate={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }}
      
     
    />
    <Circle key ={index+199} center={{ latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude) }} radius={75} />
    </>
  ))}
        
			</MapView>
      <View style={{ marginTop: 50, flex: 1 }}>
      <Button title="regNotification" onPress={()=>registerForPushNotificationsAsync()}/>
        <Button title="add place" onPress={()=>handleAddPlace()}/>
      <Text> {"lat:" + latitude+ " long :"+ longitude+" text-"}</Text>
      <Button title="start" onPress={()=>startBack()}/>
      <Button title="end" onPress={()=>removeItemValue()}/>
      
      </View>
     
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