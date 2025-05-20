import { useEffect, useState } from "react";
import { Calendar, Card, Badge, Tabs } from "antd";
import dayjs from "dayjs";

const UserAttendance = ({ userId }) => {
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().month() + 1); // Get current month (1-12)
  const [currentYear, setCurrentYear] = useState(dayjs().year()); // Get current year
  const [totalWorkedDays, setTotalWorkedDays] = useState(0);
  const [totalOverworkedDays, setTotalOverworkedDays] = useState(0);
  const [totalUnderworkedDays, setTotalUnderworkedDays] = useState(0);
  const [missingCheckoutDays, setMissingCheckoutDays] = useState(0);
  const [totalWeekdays, setTotalWeekdays] = useState(0);

  useEffect(() => {
    const startOfMonth = dayjs(`${currentYear}-${currentMonth}-01`);
    const endOfMonth = startOfMonth.endOf("month");

    let weekdays = 0;
    let workedDays = new Set(); // Use Set to store unique workdays
    let overworkedDays = 0;
    let underworkedDays = 0;
    let missedCheckouts = 0;

    attendance.forEach((entry) => {
      const entryDate = dayjs(entry.date);
      const entryDateStr = entryDate.format("YYYY-MM-DD");

      if (entryDate.month() + 1 === currentMonth && entryDate.year() === currentYear) {
        // Track unique days worked
        workedDays.add(entryDateStr);

        // Check for over 8 hours
        if (entry.checkIn && entry.checkOut) {
          const hoursWorked = dayjs(entry.checkOut).diff(dayjs(entry.checkIn), "hour", true);
          if (hoursWorked >= 8) {
            overworkedDays++;
          }
          if (hoursWorked < 8) {
            underworkedDays++;
          }
        }
        if (entry.checkIn && !entry.checkOut) {
          missedCheckouts++;
        }
      }
    });

    setTotalWorkedDays(workedDays.size);
    setTotalOverworkedDays(overworkedDays);
    setTotalWeekdays(weekdays);
    setTotalUnderworkedDays(underworkedDays);
    setMissingCheckoutDays(missedCheckouts);
  }, [attendance, currentMonth, currentYear]);


  const handlePanelChange = (value) => {
    setCurrentMonth(value.month() + 1); // month() returns 0-11, so add 1
    setCurrentYear(value.year());
  };

  useEffect(() => {
    const fetchUserAttendance = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/attendance/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    };

    const fetchHolidays = async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:9999/api/holidays/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setHolidays(data.map((holiday) => ({
          date: dayjs(holiday.date).format("YYYY-MM-DD"),
          name: holiday.name
        })));
      }
    };

    fetchUserAttendance();
    fetchHolidays();
  }, [userId]);

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");

    //Check if current month
    const isCurrentMonth = value.month() + 1 == currentMonth &&
      value.year() == currentYear
    // Find attendance entries
    const dailyAttendance = attendance.filter((item) =>
      dayjs(item.date).format("YYYY-MM-DD") === dateStr
    );
    //Checkin without checkout
    const missedCheckoutDates = attendance.filter((item) => {
      if (dailyAttendance.length > 0 && item.checkIn && !item.checkOut)
        return true;
      return false
    }
    );
    console.log(missedCheckoutDates)

    // Find holiday entries
    const holiday = holidays.find((h) => h.date === dateStr);

    // Check if the cell should be highlighted
    const isMissedWorkday =
      dayjs(value).isBefore(dayjs(), "day") && // Date is in the past
      value.day() >= 1 && value.day() <= 5 && // Weekday (Mon-Fri)
      !holiday && // Not a holiday
      dailyAttendance.length === 0 && // No check-in or check-out
      isCurrentMonth;

    const isMissedCheckout =
      dayjs(value).isBefore(dayjs(), "day") && // Date is in the past
      value.day() >= 1 && value.day() <= 5 && // Weekday (Mon-Fri)
      !holiday && // Not a holiday
      missedCheckoutDates.length > 0 &&
      isCurrentMonth

    return (
      <div>
        {
          isMissedWorkday && <div style={{ backgroundColor: "#ffcccc", padding: "4px" }} />
        }
        {isMissedCheckout && <div style={{ backgroundColor: "#ffee61", padding: "4px" }}></div>}
        <ul style={{ padding: 0, margin: 0 }}>
          {holiday && (
            <li style={{ background: "#b4d8f0", color: "red", fontWeight: "bold", listStyle: "none" }}>
              🎉 {holiday.name}
            </li>
          )}
          {dailyAttendance.map((entry) => (
            <li key={entry._id} style={{ fontSize: "12px", listStyle: "none" }}>
              {entry.checkIn && (
                <Badge status="success" text={`Check-in: ${dayjs(entry.checkIn).format("HH:mm:ss")}`} />
              )}
              <br />

              {entry.checkOut ? (
                <Badge status="error" text={`Check-out: ${dayjs(entry.checkOut).format("HH:mm:ss")}`} />
              ) : (
                <span style={{ fontSize: "12px", color: "gray" }}>No Check-out</span>
              )}
              <br />

              {/* Calculate and display total work time */}
              {entry.checkIn && entry.checkOut && (
                <li style={{ fontSize: "12px", fontWeight: "bold", color: "#007bff" }}>
                  ⏳ Worked: {Math.floor(dayjs(entry.checkOut).diff(dayjs(entry.checkIn), "minute") / 60)}h{" "}
                  {dayjs(entry.checkOut).diff(dayjs(entry.checkIn), "minute") % 60}m
                </li>
              )}
            </li>

          ))}
        </ul>
      </div>
    );
  };


  return (
    <>
      <h3>Selected Month: {currentMonth}, Year: {currentYear}</h3>
      <Card >
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <div>
            <p>Days Worked: <strong>{totalWorkedDays}</strong></p>
            <p>Days Over 8 Hours: <strong>{totalOverworkedDays}</strong></p>
            <p>Days Under 8 Hours: <strong>{totalUnderworkedDays}</strong></p>
          </div>
          <div>
            <p>
              Missing Checkouts: <strong>{missingCheckoutDays}</strong>
            </p>
          </div>
        </div>
      </Card>
      <Calendar dateCellRender={dateCellRender} onPanelChange={handlePanelChange} />
    </>
  );

};

export default UserAttendance;

