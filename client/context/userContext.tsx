import { createContext, Dispatch, useContext, useReducer } from "react";
import { userContext } from "../types";
const UserStateContext = createContext<userContext>({
    avatar: "",
    username: "",
    id: "",
    discriminator: "",
    email: "",
    guilds: []
});

const UserStateDispatchContext = createContext(
    {} as Dispatch<{ type: string; payload: userContext }>
);

const reducer = (
    state: userContext,
    action: { type: string; payload: userContext }
) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};

export const UserStateProvider = ({
    children
}: {
    children: JSX.Element[];
}) => {
    const [userState, dispatch] = useReducer(reducer, {
        avatar: "",
        username: "",
        id: "",
        discriminator: "",
        email: "",
        guilds:[],
    });
    return (
        <UserStateContext.Provider value={userState}>
            <UserStateDispatchContext.Provider value={dispatch}>
                {children}
            </UserStateDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserState = () => useContext(UserStateContext);
export const useUserStateDispatch = () => useContext(UserStateDispatchContext);
