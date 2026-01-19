import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { trackAPI, analyticsAPI } from '../services/api';
import DateRangePicker from '../components/DateRangePicker';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';
import './Dashboard.css';

const FEATURES = {
  DATE_FILTER: "date_filter",
  AGE_FILTER: "age_filter",
  GENDER_FILTER: "gender_filter",
  BAR_CLICK: "bar_chart_click"
};

function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // --------------------
  // Filter state (cookie persisted)
  // --------------------
  const [startDate, setStartDate] = useState(() => {
    const saved = Cookies.get('dashboard_startDate');
    return saved ? new Date(saved) : subDays(new Date(), 30);
  });

  const [endDate, setEndDate] = useState(() => {
    const saved = Cookies.get('dashboard_endDate');
    return saved ? new Date(saved) : new Date();
  });

  const [ageRange, setAgeRange] = useState(() => {
    return Cookies.get('dashboard_ageRange') || '';
  });

  const [gender, setGender] = useState(() => {
    return Cookies.get('dashboard_gender') || '';
  });

  const [selectedFeature, setSelectedFeature] = useState(null);

  // --------------------
  // Data state
  // --------------------
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------
  // Persist filters to cookies
  // --------------------
  useEffect(() => {
    Cookies.set('dashboard_startDate', startDate.toISOString(), { expires: 7 });
    Cookies.set('dashboard_endDate', endDate.toISOString(), { expires: 7 });
    Cookies.set('dashboard_ageRange', ageRange || '', { expires: 7 });
    Cookies.set('dashboard_gender', gender || '', { expires: 7 });
  }, [startDate, endDate, ageRange, gender]);
  

  // --------------------
  // Tracking helper
  // --------------------
  const track = async (feature) => {
    try {
      await trackAPI.track(feature);
  
      // Re-fetch analytics so new event is reflected
      fetchAnalytics();
    } catch (err) {
      console.error("Tracking failed:", err);
    }
  };
  

  // --------------------
  // Fetch analytics
  // --------------------
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: startDate ? format(startOfDay(startDate), 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endOfDay(endDate), 'yyyy-MM-dd') : undefined,
        ageRange: ageRange || undefined,
        gender: gender || undefined,
        feature: selectedFeature || undefined
      };

      const response = await analyticsAPI.getAnalytics(params);

      console.log("BAR DATA:", response.data.barChart);
      console.log("LINE DATA RAW:", response.data.lineChart);
      // Bar chart (already clean)
      setBarChartData(response.data.barChart || []);

      // Line chart (format date nicely for UI)
      const formattedLine = (response.data.lineChart || []).map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-IN")
      }));
      console.log("LINE DATA FORMATTED:", formattedLine);
      setLineChartData(formattedLine);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, ageRange, gender, selectedFeature]);

  // --------------------
  // Handlers
  // --------------------
  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    track(FEATURES.DATE_FILTER);
  };

  const handleAgeChange = (e) => {
    setAgeRange(e.target.value);
    track(FEATURES.AGE_FILTER);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    track(FEATURES.GENDER_FILTER);
  };

  const handleBarClick = (featureName) => {
    setSelectedFeature(featureName);
    track(FEATURES.BAR_CLICK);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Product Analytics Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="filters-section">
          <h2>Filters</h2>

          <div className="filter-group">
            <label>Date Range</label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />
          </div>

          <div className="filter-group">
            <label>Age Range</label>
            <select value={ageRange} onChange={handleAgeChange}>
              <option value="">All Ages</option>
              <option value="<18">Under 18</option>
              <option value="18-40">18-40</option>
              <option value=">40">Over 40</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Gender</label>
            <select value={gender} onChange={handleGenderChange}>
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="charts-section">
          {loading ? (
            <div className="loading">Loading analytics...</div>
          ) : (
            <>
              <div className="chart-container">
                <h2>Total Clicks by Feature</h2>
                {barChartData.length > 0 ? (
                  <BarChart data={barChartData} onBarClick={handleBarClick} />
                ) : (
                  <p>No data for selected filters</p>
                )}

              </div>

              <div className="chart-container">
                <h2>
                  {selectedFeature
                    ? `Daily Clicks: ${selectedFeature}`
                    : 'Daily Clicks (All Features)'}
                </h2>
                {lineChartData.length > 0 ? (
                  <LineChart data={lineChartData} />
                ) : (
                  <p>No data for selected filters</p>
                )}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
