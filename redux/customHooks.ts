// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   selectAuth,
//   setLoggedInUser,
//   setUser,
// } from "@/redux/features/authSlice";
// import { useGetUserProfileQuery } from "@/redux/services/authApi";

// export const useAuth = () => {
//   const auth = useSelector(selectAuth);
//   const dispatch = useDispatch();

//   const {
//     data: userProfile,
//     isLoading: isProfileLoading,
//     error: profileError,
//     refetch: refetchProfile,
//   } = useGetUserProfileQuery(undefined, {
//     skip: !auth.isAuthenticated || !auth.access_token || !!auth.user,
//   });

//   // Update user in redux state when profile is fetched
//   useEffect(() => {
//     if (userProfile && !auth.user) {
//       dispatch(setUser(userProfile));
//     }
//   }, [userProfile, auth.user, dispatch]);

//   return {
//     user: auth.user || userProfile,
//     isAuthenticated: auth.isAuthenticated,
//     isHydrated: auth.isHydrated,
//     access_token: auth.access_token,
//     isProfileLoading,
//     profileError,
//     refetchProfile,

//     // Helper functions
//     getFullName: () => {
//       const user = auth.user || userProfile;
//       return user?.fullname || "";
//     },

//     getFirstName: () => {
//       const user = auth.user || userProfile;
//       if (user?.fullname) {
//         return user.fullname.split(" ")[0];
//       }
//       return "";
//     },

//     getLastName: () => {
//       const user = auth.user || userProfile;
//       if (user?.fullname) {
//         const nameParts = user.fullname.split(" ");
//         return nameParts[nameParts.length - 1];
//       }
//       return "";
//     },

//     getInitials: () => {
//       const user = auth.user || userProfile;
//       if (user?.fullname) {
//         const nameParts = user.fullname.split(" ");
//         if (nameParts.length >= 2) {
//           return `${nameParts[0][0]}${
//             nameParts[nameParts.length - 1][0]
//           }`.toUpperCase();
//         }
//         return nameParts[0][0].toUpperCase();
//       }
//       return "U";
//     },
//   };
// };

"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  setLoggedInUser,
  setUser,
} from "@/redux/features/authSlice";
import { useGetUserProfileQuery } from "@/redux/services/authApi";

export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(undefined, {
    skip: !auth.isAuthenticated || !auth.access_token || !!auth.user,
  });

  // Update user in redux state when profile is fetched
  useEffect(() => {
    if (userProfile && !auth.user) {
      dispatch(setUser(userProfile));
    }
  }, [userProfile, auth.user, dispatch]);

  const currentUser = auth.user || userProfile;

  return {
    user: currentUser,
    isAuthenticated: auth.isAuthenticated,
    isHydrated: auth.isHydrated,
    access_token: auth.access_token,
    isProfileLoading,
    profileError,
    refetchProfile,

    // Helper functions
    getFullName: () => {
      return currentUser?.fullname || "";
    },

    getFirstName: () => {
      if (currentUser?.fullname) {
        return currentUser.fullname.split(" ")[0];
      }
      return "";
    },

    getLastName: () => {
      if (currentUser?.fullname) {
        const nameParts = currentUser.fullname.split(" ");
        return nameParts[nameParts.length - 1];
      }
      return "";
    },

    getInitials: () => {
      if (currentUser?.fullname) {
        const nameParts = currentUser.fullname.split(" ");
        if (nameParts.length >= 2) {
          return `${nameParts[0][0]}${
            nameParts[nameParts.length - 1][0]
          }`.toUpperCase();
        }
        return nameParts[0][0].toUpperCase();
      }
      return "U";
    },

    // Role-based helper functions
    getRole: () => {
      return currentUser?.role || null;
    },

    isAdmin: () => {
      return currentUser?.role?.toLowerCase() === "admin";
    },

    isUser: () => {
      return currentUser?.role?.toLowerCase() === "user";
    },

    // Get dashboard route based on role
    getDashboardRoute: () => {
      if (!currentUser?.role) return "/";
      return currentUser.role.toLowerCase() === "admin" ? "/admin" : "/user";
    },
  };
};
