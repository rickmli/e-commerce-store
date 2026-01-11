import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { getDatesInRange } from "../utils/date.js";

export const getAnalyticData = async (req, res) => {
  const analyticsData = await getTotalSalesData();

  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const dailySalesData = await getDailySalesData(startDate, endDate);

  res.json({
    analyticsData,
    dailySalesData,
  });
};

const getTotalSalesData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

const getDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 },
        revenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // example of dailySalesData
  // [
  // 	{
  // 		_id: "2024-08-18",
  // 		sales: 12,
  // 		revenue: 1450.75
  // 	},
  // ]

  const dateArray = getDatesInRange(startDate, endDate);
  // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);

    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
};
