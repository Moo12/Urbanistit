const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const cors = require("cors");
const corsHandler = cors({origin: true}); // You can restrict to a domain like { origin: 'https://yourdomain.com' }


exports.moveImage = functions.https.onCall(async (data, context) => {
  console.log("Context Auth:", context.auth);

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated",
        "User must be signed in");
  }

  const {oldPath, newPath} = data;
  const bucket = admin.storage().bucket();

  try {
    await bucket.file(oldPath).copy(bucket.file(newPath));
    await bucket.file(oldPath).delete();

    const newUrl = await bucket.file(newPath).getSignedUrl({action: "read",
      expires: "03-01-2500"});

    return {
      message: "File moved successfully",
      url: newUrl[0],
    };
  } catch (error) {
    console.error("Error moving file", error);
    throw new functions.https.HttpsError("internal", "File move failed",
        error.message);
  }
});

exports.moveImageHttps = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({error: "Unauthorized"});
    }

    const idToken = authHeader.split("Bearer ")[1];

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("Decoded token:", decodedToken);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({error: "Unauthorized"});
    }

    const {oldPath, newPath} = req.body.data;
    const bucket = admin.storage().bucket();

    try {
      const [files] = await bucket.getFiles({prefix: "images/undefined/"});
      console.log("Available files:", files);

      await bucket.file(oldPath).copy(bucket.file(newPath));
      await bucket.file(oldPath).delete();

      await bucket.file(newPath).makePublic();
      const publicUrl =`https://storage.googleapis.com/${bucket.name}/${newPath}`;

      res.status(200).json({
        message: "File moved successfully",
        url: publicUrl,
      });
    } catch (error) {
      console.error("Error moving file", error);
      res.status(500).json({error: "File move failed", details: error.message});
    }
  });
});

