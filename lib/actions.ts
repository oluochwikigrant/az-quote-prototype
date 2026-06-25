"use server";

import { revalidatePath } from "next/cache";
import { StudentSchema } from "./formValidationSchemas";
import { students as mockStudents } from "./dummyData";

type CurrentState = { success: boolean; error: boolean };

// In-memory student store
let studentData = [...mockStudents];
let nextStudentId = studentData.length + 1;

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    const newStudent = {
      id: `stu${nextStudentId++}`,
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      createdAt: new Date(),
    };
    studentData.push(newStudent as any);
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const idx = studentData.findIndex(s => s.id === data.id);
    if (idx !== -1) {
      studentData[idx] = {
        ...studentData[idx],
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
      };
    }
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    const idx = studentData.findIndex(s => s.id === id);
    if (idx !== -1) {
      studentData.splice(idx, 1);
    }
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
