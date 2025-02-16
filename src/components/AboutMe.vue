<template>
    <div>   <!-- introduction --> 
    <div class=" w-full h-full bg-cover bg-center aspect-[16/9]" :style="{ backgroundImage: `url(${backgroundImage})` }"
    >

        <div class="flex flex-row justify-center items-stretch mx-auto gap-1 w-2/2">
            <div class="flex flex-col items-center flex-[2]">
                <p  class="font-bold md:text-4xl lg:text-5xl text-lg text-center contact-me-bg tracking-wide "> Don't be pushed by your problems be led by your dreams</p>
                <p  class="text-md my-2 text-2xl contact-me-bg text-center">Ralph Waldo Emerson</p>
            </div>
            <div class="flex flex-[1]">
                <img :src="quotedImg" alt="Overlay Image"
                    class="object-cover ">
            </div>
            

        </div>

      <!-- Background Image -->
      <!-- <img :src="coverImage" alt="Background Image" class="w-full"> -->

      <!-- Overlay Image (centered) -->


    </div>
    <!--paragracph about me -->
    <div class="text-right my-10">
      <h1 class="font-bold text-5xl">היי! איזה כיף שהגעת. נעים להכיר, אני מאיה</h1>
      <p class="my-7 text-lg tracking-wide">
        זאת אני, סיטי גירל בכל רמ״ח איברי. משוטטת ברחובות, לוגמת קפה או יין בכל פינה חדשה שנפתחת, צופה בעוברים ושבים וגומעת ספרים בכל רגע פנוי. במאי 2023 החלטתי לצעוד בנתיב חדש ויצאתי לחיי נוודות, להגשים חלום ישן לטייל בעולם, לטעום תרבויות שונות (תרתי משמע – אני חובבת אוכל מושבעת!), ולהתאהב שוב ושוב בערים המדהימות שהאנושות יצרה.<br/><br>
חיי הנוודות שלי אינם רק הרפתקה אישית – כבוגרת תואר שני בעיצוב אורבני מ׳בצלאל׳, הם מהווים מעבדה חיה לחקר המרחב העירוני. בכל עיר אני מתעמקת בתרבות המקומית, בוחנת את המרקם העירוני, ולומדת כיצד תושבים מתנהלים במרחב. מהמטבח המקומי ועד לתשתיות העירוניות, כל פרט מספר סיפור על העיר ותושביה. <br/><br>



את התובנות והחוויות האלה אני מביאה לכל פרויקט שאני לוקחת. אני מאמינה שכדי ליצור מקומות שטוב לחיות בהם, צריך קודם כל להקשיב, לחקור ולהבין לעומק. וזה בדיוק מה שאני עושה – משלבת את הידע המקצועי שלי עם הניסיון העשיר מהשטח כדי ליצור פתרונות שעובדים באמת. <br/><br>



רוצה לראות עם מי ועל מה עבדתי עד עכשיו?
      </p>
    </div>
  </div>

</template>

<script>
import { watchEffect, onMounted, ref } from 'vue';
import useImageMetadata from '@/composables/fetchImageMetadata'
import useGeneralContentMetadata from '@/composables/fetchGeneralContent';

export default {
  setup(){
    const backgroundImage = ref('')
    const quotedImg = ref('')
    
    const { imagesMetadata, error } = useImageMetadata();

    const { generalContentMetadata, error: generalContentError } = useGeneralContentMetadata()


    onMounted(() => {
    })

    watchEffect(() => {
        if (imagesMetadata?.value?.length && generalContentMetadata?.value?.length){
              generalContentMetadata.value.forEach(generalContentItem => {
                if (generalContentItem.id === "about_me"){
                  let coverImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.cover_img_metadata)

                  if (coverImgMd?.length){
                    backgroundImage.value = coverImgMd[0].image_url
                  }
                  else{
                    console.error('no iimagesMetadatamage metadata for about me cover')
                  }

                  let quatesImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.quotes_img_metadata)

                  if (quatesImgMd?.length){
                    quotedImg.value = quatesImgMd[0].image_url
                  }
                  else{
                    console.error('no image metadata for about me quotes')
                  }
              }
            })
        }
    })

    return { backgroundImage, quotedImg }
  }
}
</script>

<style>

.bg-intro-cover {
  background-image: url('../assets/img/gur_cover.jpg');
  background-size: cover;
  background-position: center;
  width: 100%;
  aspect-ratio: 16/9; 
}


</style>