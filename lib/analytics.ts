import { analytics } from "@/lib/firebase"
import { logEvent } from "firebase/analytics"

/**
 * Firebase Analytics'e custom event gönder
 * @param eventName Event adı
 * @param eventParams Event parametreleri
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, any>
) {
  if (!analytics) {
    console.warn("Analytics başlatılmamış")
    return
  }

  try {
    logEvent(analytics, eventName, eventParams)
  } catch (error) {
    console.error("Event tracking hatası:", error)
  }
}

/**
 * Kullanıcı girişini track et
 */
export function trackLogin(userId: string, method: string = "email") {
  trackEvent("login", {
    method,
    user_id: userId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Kullanıcı kaydını track et
 */
export function trackSignUp(userId: string, method: string = "email") {
  trackEvent("sign_up", {
    method,
    user_id: userId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Çıkışı track et
 */
export function trackLogout(userId: string) {
  trackEvent("logout", {
    user_id: userId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Task oluşturmayı track et
 */
export function trackTaskCreated(taskId: string, priority: string) {
  trackEvent("task_created", {
    task_id: taskId,
    priority,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Task tamamlanmasını track et
 */
export function trackTaskCompleted(taskId: string) {
  trackEvent("task_completed", {
    task_id: taskId,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Sayfa görüntülenmesini track et
 */
export function trackPageView(pageName: string) {
  trackEvent("page_view", {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Hata logging
 */
export function trackError(errorMessage: string, errorCode?: string) {
  trackEvent("error", {
    message: errorMessage,
    code: errorCode,
    timestamp: new Date().toISOString(),
  })
}
