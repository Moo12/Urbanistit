<template>
  <div>   <!-- introduction --> 
      <!-- Background Image -->

      <div class="flex flex-row justify-center mx-auto gap-1 padding-section">
          <div class="flex-[1] flex flex-col justify-center items-center gap-3">
            <div>
              <p  class="header-title text-center font-heebo black-light tracking-wide "> Don't be pushed by your problems</p>
              <p  class="header-title text-center font-heebo black-light tracking-wide "> be led by your dreams</p>
            </div>
              <p  class="section-title-main font-heebo black-light text-center">Ralph Waldo Emerson</p>
          </div>
          <!-- Quatations Image -->
          <div class="flex-[1] flex justify-center">
              <img :src="quotedImg" alt="Overlay Image"
                  class="object-cover h-full">
          </div>
      </div>
      <div class=" w-full h-full bg-cover bg-center aspect-[16/9]" :style="{ backgroundImage: `url(${backgroundImage})` }">
    </div>
    <!--paragracph about me -->
    <div class="text-right mt-10 padding-section">
      <p class="header-title-sub">היי! איזה כיף שהגעת. נעים להכיר, אני מאיה</p>
      <p class="mt-7 section-title-main tracking-wide">
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
        if (imagesMetadata?.value?.length && generalContentMetadata?.value?.get("about_me")){
                  const generalContentItem = generalContentMetadata.value.get("about_me")
                  let coverImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.cover)

                  if (coverImgMd?.length){
                    backgroundImage.value = coverImgMd[0].image_url
                  }
                  else{
                    console.error('no iimagesMetadatamage metadata for about me cover')
                  }

                  let quatesImgMd = imagesMetadata.value.filter( item => item.id === generalContentItem.common_data?.images_metadata?.quotes)

                  if (quatesImgMd?.length){
                    quotedImg.value = quatesImgMd[0].image_url
                  }
                  else{
                    console.error('no image metadata for about me quotes')
                  }
              }
        })

    return { backgroundImage, quotedImg }
  }
}
</script>

<style>

</style>