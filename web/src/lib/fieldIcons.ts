import emailIcon from "../assets/icons/email.svg";
import facebookIcon from "../assets/icons/facebook.svg";
import githubIcon from "../assets/icons/github.svg";
import googleMapsIcon from "../assets/icons/google-maps.svg";
import instagramIcon from "../assets/icons/instagram.svg";
import linkedinIcon from "../assets/icons/linkedin.svg";
import phoneIcon from "../assets/icons/phone.svg";
import spotifyIcon from "../assets/icons/spotify.svg";
import telegramIcon from "../assets/icons/telegram.svg";
import threadsIcon from "../assets/icons/threads.svg";
import tiktokIcon from "../assets/icons/tiktok.svg";
import webIcon from "../assets/icons/web.svg";
import whatsappIcon from "../assets/icons/whatsapp.svg";
import wifiIcon from "../assets/icons/wifi.svg";
import xIcon from "../assets/icons/x.svg";
import youtubeIcon from "../assets/icons/youtube.svg";

export const fieldIcons: Record<string, string> = {
  em: emailIcon,
  wa: whatsappIcon,
  ph: phoneIcon,
  ig: instagramIcon,
  tw: xIcon,
  th: threadsIcon,
  fb: facebookIcon,
  li: linkedinIcon,
  yt: youtubeIcon,
  tt: tiktokIcon,
  gh: githubIcon,
  tg: telegramIcon,
  sp: spotifyIcon,
  sa: spotifyIcon,
  gm: googleMapsIcon,
  web: webIcon,
  wf: wifiIcon,
};

export function getFieldIcon(id: string): string | undefined {
  return fieldIcons[id];
}
