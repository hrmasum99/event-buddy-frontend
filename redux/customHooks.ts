"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAuth,
  setLoggedInUser,
  setUser,
  initializeAuth,
  clearAuthState,
} from "@/redux/features/authSlice";
import { useGetUserProfileQuery } from "@/redux/services/authApi";

export const useAuth = () => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

  // Initialize auth state from cookies on first load
  useEffect(() => {
    if (!auth.isHydrated) {
      dispatch(initializeAuth());
    }
  }, [dispatch, auth.isHydrated]);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useGetUserProfileQuery(undefined, {
    // Fetch profile if we have a token, regardless of isAuthenticated state
    skip: !auth.access_token,
  });

  // Handle profile fetch success
  useEffect(() => {
    if (userProfile && auth.access_token) {
      // If we have both user profile and token, ensure full login state
      dispatch(
        setLoggedInUser({
          user: userProfile,
          access_token: auth.access_token,
          twoFactorRequired: userProfile.isTwoFactorEnabled,
        })
      );
    } else if (userProfile && !auth.access_token) {
      // If we have user but no token, just set the user
      dispatch(setUser(userProfile));
    }
  }, [userProfile, auth.access_token, dispatch]);

  // Handle profile fetch error (token might be invalid)
  useEffect(() => {
    if (profileError && auth.access_token) {
      // If profile fetch fails but we have a token, token might be invalid
      console.error("Profile fetch failed, clearing auth state:", profileError);
      dispatch(clearAuthState());
    }
  }, [profileError, auth.access_token, dispatch]);

  // Validate auth state consistency
  useEffect(() => {
    if (auth.isHydrated) {
      // If we have a token but no authentication, try to authenticate
      if (auth.access_token && !auth.isAuthenticated && !isProfileLoading) {
        // Token exists but not authenticated - profile fetch should handle this
        return;
      }

      // If authenticated but missing critical data, clear state
      if (auth.isAuthenticated && !auth.access_token) {
        console.warn("Authenticated but no token, clearing auth state");
        dispatch(clearAuthState());
      }
    }
  }, [
    auth.isAuthenticated,
    auth.access_token,
    auth.user,
    auth.isHydrated,
    isProfileLoading,
    dispatch,
  ]);

  const currentUser = auth.user || userProfile;

  return {
    user: currentUser,
    access_token: auth.access_token,
    isAuthenticated:
      (auth.isAuthenticated || !!auth.access_token) && !!currentUser,
    isHydrated: auth.isHydrated,
    isProfileLoading,
    is2FAEnabled: auth.twoFactorRequired,
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
      // return currentUser.role.toLowerCase() === "admin" ? "/admin" : "/user";
      return "/accounts";
    },

    // isAuth: () => {
    //   if (!auth.isAuthenticated) return "/";
    // },
  };
};
