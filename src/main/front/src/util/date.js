import {format, register} from 'timeago.js' //  임포트해서 register 한국어 선택
import koLocale from 'timeago.js/lib/lang/ko' // 한국어 선택

register('ko', koLocale)

export function formatAgo(date, lang='en_US'){
  return format(date, lang);
}