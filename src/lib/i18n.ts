// ข้อความภาษาไทยสำหรับแอปพลิเคชัน
export const th = {
  // Auth
  auth: {
    email: "อีเมล",
    password: "รหัสผ่าน",
    fullName: "ชื่อเต็ม",
    signIn: "เข้าสู่ระบบ",
    signUp: "สมัครสมาชิก",
    signOut: "ออกจากระบบ",
    forgotPassword: "ลืมรหัสผ่าน?",
    noAccount: "ยังไม่มีบัญชี?",
    haveAccount: "มีบัญชีอยู่แล้วหรือ?",
    signUpFree: "สมัครฟรี",
    createAccount: "สร้างบัญชี",
    welcomeBack: "ยินดีต้อนรับกลับมา",
    signInToDashboard: "เข้าสู่ระบบแดชบอร์ดของคุณ",
    createAccountText: "สร้างบัญชีของคุณ",
    freeToStart: "ฟรีในการเริ่มต้น ไม่ต้องใช้บัตรเครดิต",
    invalidEmailPassword: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    accountExists: "บัญชีนี้มีอยู่แล้ว",
    passwordMin8: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร",
    invalidEmail: "อีเมลไม่ถูกต้อง",
    passwordPlaceholder: "อย่างน้อย 8 ตัวอักษร",
  },

  // Restaurant
  restaurant: {
    title: "การตั้งค่าร้านอาหาร",
    description: "จัดการโปรไฟล์ร้านอาหารและการตั้งค่าเมนูสาธารณะ",
    name: "ชื่อร้านอาหาร",
    slug: "URL สั้น",
    description_label: "คำอธิบาย",
    logo: "โลโก้",
    cover: "ภาพปก",
    phone: "เบอร์โทรศัพท์",
    lineContact: "ID Line",
    googleMaps: "Google Maps",
    address: "ที่อยู่",
    themeColor: "สีธีม",
    setupYourRestaurant: "ตั้งค่าร้านอาหารของคุณ",
    setupRestaurantDescription: "เริ่มต้นด้วยการสร้างโปรไฟล์ร้านอาหาร คุณจะสามารถเพิ่มหมวดหมู่เมนูและรายการได้",
    createRestaurant: "สร้างร้านอาหาร",
    saveChanges: "บันทึกการเปลี่ยนแปลง",
  },

  // Menu Categories
  categories: {
    title: "หมวดหมู่เมนู",
    description: "จัดระเบียบส่วนเมนูของคุณและการมองเห็น",
    newCategory: "หมวดหมู่ใหม่",
    addCategory: "เพิ่มหมวดหมู่",
    visible: "มองเห็นได้",
    hidden: "ซ่อน",
    toggle: "สลับ",
    delete: "ลบ",
    noCategories: "ยังไม่มีหมวดหมู่",
  },

  // Menu Items
  menuItems: {
    title: "รายการเมนู",
    description: "เพิ่มจานอาหารและจัดการความพร้อมใช้งาน",
    itemName: "ชื่อรายการ",
    price: "ราคา",
    category: "หมวดหมู่",
    available: "พร้อมใช้งาน",
    unavailable: "ไม่พร้อมใช้งาน",
    addItem: "เพิ่มรายการ",
    noItems: "ยังไม่มีรายการเมนู",
  },

  // QR Code
  qrCode: {
    title: "QR Code",
    description: "แชร์ QR Code นี้กับลูกค้าของคุณ",
    publicMenuUrl: "URL เมนูสาธารณะ:",
    download: "ดาวน์โหลด QR Code PNG",
  },

  // Subscription
  subscription: {
    title: "สมาชิก",
    currentPlan: "แผนปัจจุบัน",
    free: "ฟรี",
    pro: "Pro",
    freePlan: "แผนฟรี",
    proPlan: "แผน Pro",
    unlimited: "ไม่จำกัด",
    features: "คุณสมบัติ",
    menuItems: "รายการเมนู",
    maxRestaurants: "ร้านอาหารสูงสุด",
    removeBranding: "ลบแบรนด์ MenuQR",
    customTheme: "สีธีมแบบกำหนดเอง",
    upgradeMock: "อัปเกรด (Mock)",
  },

  // Dashboard
  dashboard: {
    title: "แดชบอร์ด",
    welcome: "ยินดีต้อนรับกลับมา",
    overviewMenu: "นี่คือภาพรวมของเมนูร้านอาหารของคุณ",
    upgradeToPro: "อัปเกรดเป็น Pro",
    menuItems: "รายการเมนู",
    categories: "หมวดหมู่",
    publicMenu: "เมนูสาธารณะ",
    liveMenu: "เปิดใช้งาน",
    scanToView: "สแกนเพื่อดู",
    manageMenuItems: "จัดการรายการเมนู",
    addEditUpdate: "เพิ่ม แก้ไข หรืออัปเดตจานอาหารของคุณ",
    manageCategories: "จัดการหมวดหมู่",
    organizeMenuSections: "จัดระเบียบส่วนเมนูของคุณ",
    viewPublicMenu: "ดูเมนูสาธารณะ",
    seeWhatCustomersSee: "ดูสิ่งที่ลูกค้าเห็น",
    usageLimit: "การใช้งาน",
    itemLimit: "ถึงขีดจำกัดแล้ว อัปเกรดเป็น Pro สำหรับรายการไม่จำกัด",
  },

  // Sidebar
  sidebar: {
    dashboard: "แดชบอร์ด",
    restaurant: "ร้านอาหาร",
    categories: "หมวดหมู่",
    menuItems: "รายการเมนู",
    qrCode: "QR Code",
    subscription: "สมาชิก",
  },

  // General
  general: {
    save: "บันทึก",
    cancel: "ยกเลิก",
    delete: "ลบ",
    edit: "แก้ไข",
    add: "เพิ่ม",
    loading: "กำลังโหลด...",
    error: "เกิดข้อผิดพลาด",
    success: "สำเร็จ",
    noData: "ไม่มีข้อมูล",
    unlimited: "ไม่จำกัด",
  },
};
