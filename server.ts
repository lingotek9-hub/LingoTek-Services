import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { SCHOLARSHIPS } from "./src/data/scholarships";
import { SERVICES } from "./src/data/services";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: history ? [...history, { role: 'user', parts: [{ text: message }] }] : message,
        config: {
          systemInstruction: `أنت لينغو، المساعد الشخصي لمنصة لينجوتك (LingoTek). 
مهمتك هي مساعدة الطلاب السودانيين في الحصول على منح دراسية وخدمات أكاديمية.
تحدث باللهجة السودانية المحببة واستخدم مصطلحات مثل: أبشر، قدّم طوالي، يا زول، كدي روق، اكسر الحنك (إذا المنحة ما مناسبة)، ظبط أمورك.

معلومات عن لينجوتك:
- المنح الدراسية المتوفرة حالياً: ${JSON.stringify(SCHOLARSHIPS.map(s => ({ title: s.title, country: s.country, level: s.level, deadline: s.deadline, coverage: s.coverage })))}
- الخدمات والأسعار: ${JSON.stringify(SERVICES.map(s => ({ title: s.title, price: s.pricing })))}

طريقة التعامل:
1. كن ودوداً جداً ومحفزاً (أسلوبك تسويقي قوي).
2. إذا سأل الطالب عن منحة، أعطه تفاصيلها وشجعه يقدم (أبشر، المنحة دي طلقة!).
3. إذا سأل عن خدمة، وضح له أهميتها وسعرها (بنظبط ليك SOP عالمي يا زول).
4. دائماً شجعهم يتواصلوا واتساب للبدء الفعلي (رقم الواتساب: 249117734901+).
5. إذا كانت ظروف الطالب (معدله أو لغته) لا تسمح ببعض المنح، قل له بكل صراحة "اكسر الحنك في دي حالياً" ونبهه لمنحة أخرى مناسبة أو خدمة تحسن ملفه.
6. أعرِف الطالب أن رسوم التقديم عبر مكتبنا هي 50 ألف جنيه سوداني فقط، وهذه الرسوم تشمل كل المتطلبات والتقديم من الألف للياء (SOP, CV, Translate, etc. إذا كانت ضمن باقة التقديم الكامل).
7. هدفك النهائي هو إقناع الطالب بالتقديم عبر لينجوتك.`,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: "حدث خطأ في المساعد الشخصي" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
