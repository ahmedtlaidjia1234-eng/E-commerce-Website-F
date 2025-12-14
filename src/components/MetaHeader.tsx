import { useStore } from "@/lib/store";
import { Helmet } from "react-helmet-async";


export default function Header() {
const {websiteSettings} = useStore()

const {metaTitle,metaDesc,metaKeyWords} = websiteSettings?.companyInfo
  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>

        <meta name="description" content={metaTitle} />
        <meta name="keywords" content={metaKeyWords?.toString()} />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
      </Helmet>
    </>
  );
}