import { ref, readonly } from "vue";
import { projectAuth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Create a reactive reference for the user
const user = ref(null);
const _projectAuth = ref(null)

// Attach the Firebase auth state listener (only once)
onAuthStateChanged(projectAuth, (_user) => {
  user.value = _user; // Update the ref with the user object or null
  _projectAuth.value = projectAuth
  console.log(_user ? "User is logged in:" : "No user logged in.", _user);
});

// Expose the user state as readonly (prevents unwanted modifications)
export default function getUser() {
  return { user: user, projectAuth: readonly(_projectAuth)};
}