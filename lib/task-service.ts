import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore"
import { trackTaskCreated, trackTaskCompleted, trackError } from "@/lib/analytics"

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string // User UID
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

/**
 * Yeni task oluştur
 */
export async function createTask(
  taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...taskData,
      dueDate: Timestamp.fromDate(taskData.dueDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    // Analytics'e track et
    trackTaskCreated(docRef.id, taskData.priority)
    return docRef.id
  } catch (error) {
    console.error("Task oluşturma hatası:", error)
    trackError("Task oluşturma başarısız", "TASK_CREATE_ERROR")
    return null
  }
}

/**
 * Task'ı güncelle
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<boolean> {
  try {
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    }
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate)
    }
    await updateDoc(doc(db, "tasks", taskId), updateData)
    
    // Eğer status "completed" olarak değiştiriliyorsa track et
    if (updates.status === "completed") {
      trackTaskCompleted(taskId)
    }
    
    return true
  } catch (error) {
    console.error("Task güncelleme hatası:", error)
    trackError("Task güncelleme başarısız", "TASK_UPDATE_ERROR")
    return false
  }
}

/**
 * Task'ı sil
 */
export async function deleteTask(taskId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "tasks", taskId))
    return true
  } catch (error) {
    console.error("Task silme hatası:", error)
    return false
  }
}

/**
 * Belirli kullanıcıya atanan task'ları al
 */
export async function getUserTasks(userId: string): Promise<Task[]> {
  try {
    const q = query(
      collection(db, "tasks"),
      where("assignedTo", "==", userId)
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task
    })
  } catch (error) {
    console.error("Kullanıcı task'ları getirme hatası:", error)
    return []
  }
}

/**
 * Tüm task'ları al (admin için)
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    const snapshot = await getDocs(collection(db, "tasks"))
    return snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Task
    })
  } catch (error) {
    console.error("Task'ları getirme hatası:", error)
    return []
  }
}
