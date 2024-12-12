import { atom } from "recoil";

export const monthAtom = atom({
    key:"currentMonth",
    default: new Date(),
});

export const selectDateAtom = atom({
    key:"selectedDate",
    default:null
});