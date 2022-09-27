import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import calender from "dayjs/plugin/calendar";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.extend(calender);
dayjs.locale("zh-cn");

const time = dayjs;

export default time;
