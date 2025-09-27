import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";

const EmployeeManagement = () => {
  const navigate = useNavigate();

  const quickStats = [
    {
      title: "Total Employees",
      value: "245",
      change: "+12%",
      changeType: "increase",
      icon: <PeopleIcon />,
      color: "primary",
    },
    {
      title: "Active Employees",
      value: "238",
      change: "+8%",
      changeType: "increase",
      icon: <TrendingUpIcon />,
      color: "success",
    },
    {
      title: "New This Month",
      value: "15",
      change: "+25%",
      changeType: "increase",
      icon: <PersonAddIcon />,
      color: "info",
    },
    {
      title: "Pending Reviews",
      value: "8",
      change: "-3%",
      changeType: "decrease",
      icon: <AssignmentIcon />,
      color: "warning",
    },
  ];

  const quickActions = [
    {
      title: "View All Employees",
      description: "Browse and manage all employee records",
      action: () => navigate("/employees"),
      icon: <PeopleIcon />,
      color: "primary",
    },
    {
      title: "Add New Employee",
      description: "Create a new employee profile",
      action: () => navigate("/employees/create"),
      icon: <PersonAddIcon />,
      color: "success",
    },
    {
      title: "Employee Reports",
      description: "Generate employee analytics and reports",
      action: () => navigate("/reports/employees"),
      icon: <DashboardIcon />,
      color: "info",
    },
    {
      title: "Bulk Operations",
      description: "Perform bulk updates and imports",
      action: () => navigate("/employees/bulk"),
      icon: <AssignmentIcon />,
      color: "warning",
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Employee Management Dashboard
      </Typography>

      {/* Quick Stats */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={stat.change}
                  size="small"
                  color={stat.changeType === "increase" ? "success" : "error"}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Quick Actions
      </Typography>
      <Grid container spacing={3}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
              onClick={action.action}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: `${action.color}.main`,
                    mx: "auto",
                    mb: 2,
                    width: 56,
                    height: 56,
                  }}
                >
                  {action.icon}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {action.description}
                </Typography>
                <Button
                  variant="outlined"
                  color={action.color}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.action();
                  }}
                >
                  Go
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 4 }}>
        Recent Activity
      </Typography>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body2" color="textSecondary">
              Recent employee activities will appear here
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => navigate("/employees")}
            >
              View All Employees
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeManagement;
