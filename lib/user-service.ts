import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import type { UserProfile } from "@/lib/auth-context"

/**
 * Kullanıcı profilini Firebase'den al
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    return userDoc.exists() ? (userDoc.data() as UserProfile) : null
  } catch (error) {
    console.error("Profil getirme hatası:", error)
    return null
  }
}

/**
 * Kullanıcı profilini Firebase'de güncelle
 */
export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<boolean> {
  try {
    await updateDoc(doc(db, "users", uid), updates)
    return true
  } catch (error) {
    console.error("Profil güncelleme hatası:", error)
    return false
  }
}

/**
 * Kullanıcıyı admin yap
 */
export async function makeUserAdmin(uid: string): Promise<boolean> {
  return updateUserProfile(uid, { role: "admin" })
}

/**
 * Kullanıcıyı adi kullanıcıya çevir
 */
export async function makeUserRegular(uid: string): Promise<boolean> {
  return updateUserProfile(uid, { role: "user" })
}
