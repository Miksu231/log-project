import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

export const useFirebase = () => {
	const firebaseConfig = {
		apiKey: "AIzaSyBBGw8c8NcLXmSAqMcctS1zybaNxSPenK4",
		authDomain: "calendar-log-b65f5.firebaseapp.com",
		projectId: "calendar-log-b65f5",
		storageBucket: "calendar-log-b65f5.appspot.com",
		messagingSenderId: "525257340348",
		appId: "1:525257340348:web:12302b7721a59454fce7b9",
		measurementId: "G-0QH6YDGBZR",
	}

	const firebaseApp = initializeApp(firebaseConfig)
	const firestore = getFirestore(firebaseApp)

	return {
		firebaseApp,
		firestore,
	}
}