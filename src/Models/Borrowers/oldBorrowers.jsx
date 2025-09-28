// Guard to ensure we only fetch borrowers once per page load (even under React StrictMode)

import React, { useRef } from "react";
import { UserContext } from "../../App";
import ClickableText from "../../ModelAssets/ClickableText";
import CreateBorrower from "./CreateBorrower/CreateBorrower";
import { useTheme } from "@mui/material/styles";
import CollectionsTemplate from "../../ModelAssets/CollectionsTemplate";
import { useCrudOperations } from "../../hooks/useCrudOperations";
import { generateClient } from "aws-amplify/api";
import NotificationBar from "../../ModelAssets/NotificationBar";
import { useNavigate } from "react-router-dom";

let __borrowersFetchedOnce = false;

const LIST_BORROWERS_QUERY = `
  query ListBorrowers($branchId: ID!, $nextToken: String) {
    listBorrowers(
      filter: { branchBorrowersId: { eq: $branchId } }
      limit: 100
      nextToken: $nextToken
    ) {
      items {
        id
        firstname
        othername
        businessName
        typeOfBusiness
        uniqueIdNumber
        phoneNumber
        otherPhoneNumber
        email
        gender
        dateOfBirth
        nationality
        address
        city
        state
        title
        zipcode
        employmentStatus
        employerName
        creditScore
        customFieldsData
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

const CREATE_BORROWER_MUTATION = `
  mutation CreateBorrower($input: CreateBorrowerInput!) {
    createBorrower(input: $input) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      address
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      customFieldsData
      createdAt
      updatedAt
    }
  }
`;

const DELETE_BORROWER_MUTATION = `
  mutation DeleteBorrower($input: DeleteBorrowerInput!) {
    deleteBorrower(input: $input) {
      id
    }
  }
`;

const UPDATE_BORROWER_MUTATION = `
  mutation UpdateBorrower($input: UpdateBorrowerInput!) {
    updateBorrower(input: $input) {
      id
      firstname
      othername
      businessName
      typeOfBusiness
      uniqueIdNumber
      phoneNumber
      otherPhoneNumber
      email
      gender
      dateOfBirth
      nationality
      address
      city
      state
      title
      zipcode
      employmentStatus
      employerName
      creditScore
      customFieldsData
      createdAt
      updatedAt
    }
  }
`;

export default function Borrowers() {
  const [editMode, setEditMode] = React.useState(false);
  const formRef = useRef();
  const { userDetails } = React.useContext(UserContext);
  const theme = useTheme();
  const [processedBorrowers, setProcessedBorrowers] = React.useState([]);
  const [allBorrowers, setAllBorrowers] = React.useState([]);
  const [borrowersLoading, setBorrowersLoading] = React.useState(true);
  const [notification, setNotification] = React.useState({
    message: "",
    color: "green",
  });
  const client = React.useMemo(() => generateClient(), []); // stabilize client so effect does not re-trigger infinitely
  const navigate = useNavigate();

  const {
    items: borrowers,
    loading,
    editDialogOpen,
    editDialogRow,
    createDialogOpen,
    deleteDialogOpen,
    deleteDialogRow,
    deleteLoading,
    deleteError,
    fetchItems: originalFetchBorrowers,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleEditSuccess: originalHandleEditSuccess,
    handleDeleteDialogOpen,
    handleDeleteDialogClose,
    handleDeleteConfirm: originalHandleDeleteConfirm,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    handleCreateSuccess: originalHandleCreateSuccess,
  } = useCrudOperations(
    "Borrower",
    LIST_BORROWERS_QUERY,
    null,
    UPDATE_BORROWER_MUTATION,
    DELETE_BORROWER_MUTATION,
    "listBorrowers"
  );

  // Custom fetch function with pagination support
  const fetchBorrowers = React.useCallback(
    async (variables = {}) => {
      console.log("Fetching borrowers with pagination...");
      setBorrowersLoading(true);
      try {
        let allBorrowersList = [];
        let nextToken = null;
        let iteration = 0;
        while (true) {
          const queryVariables = {
            ...variables,
            ...(nextToken && { nextToken }),
          };
          console.log(
            `Fetching batch ${iteration + 1} with nextToken: ${
              nextToken || "null"
            }`
          );
          const result = await client.graphql({
            query: LIST_BORROWERS_QUERY,
            variables: queryVariables,
          });
          // Defensive: handle unexpected shapes
          const listResult = result?.data?.listBorrowers || {};
          const batchItems = Array.isArray(listResult.items)
            ? listResult.items
            : [];
          allBorrowersList.push(...batchItems);
          const newNextToken = listResult.nextToken || null;
          console.log(
            `Fetched ${batchItems.length} borrowers in this batch. Total: ${allBorrowersList.length}. NextToken: ${newNextToken}`
          );
          // Break conditions
          if (!newNextToken) {
            console.log("No nextToken returned. Pagination complete.");
            break;
          }
          if (newNextToken === nextToken) {
            console.warn(
              "Next token did not advance. Stopping to prevent infinite loop."
            );
            break;
          }
          if (++iteration > 50) {
            console.warn(
              "Safety cap (50 iterations) reached. Stopping pagination."
            );
            break;
          }
          nextToken = newNextToken;
        }
        console.log(
          `Finished fetching all borrowers. Total count: ${allBorrowersList.length}`
        );
        setAllBorrowers(allBorrowersList);
        return allBorrowersList;
      } catch (err) {
        console.error("Error fetching borrowers with pagination:", err);
        setAllBorrowers([]);
        throw err;
      } finally {
        setBorrowersLoading(false);
      }
    },
    [client]
  );

  // API handler for creating borrower
  const handleCreateBorrowerAPI = async (values) => {
    if (!userDetails?.branchUsersId) {
      throw new Error("Error: Please try refreshing the page.");
    }

    const input = {
      firstname: values.firstname?.trim() || null,
      othername: values.othername?.trim() || null,
      businessName: values.businessName?.trim() || null,
      typeOfBusiness: values.typeOfBusiness?.trim() || null,
      uniqueIdNumber: values.uniqueNumber?.trim() || null,
      phoneNumber: values.mobile?.trim() || null,
      otherPhoneNumber: values.altPhone?.trim() || null,
      email: values.email?.trim() || null,
      gender: values.gender || null,
      dateOfBirth: values.dob || null,
      nationality: values.country || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.province?.trim() || null,
      title: values.title || null,
      zipcode: values.zipcode?.trim() || null,
      employmentStatus: values.workingStatus || null,
      employerName: values.employerName?.trim() || null,
      creditScore: values.creditScore?.trim() || null,
      branchBorrowersId: userDetails.branchUsersId,
    };

    const customFieldsData = {};
    Object.keys(values).forEach((key) => {
      if (key.startsWith("custom_")) {
        const fieldId = key.replace("custom_", "");
        customFieldsData[fieldId] = {
          fieldId,
          value:
            typeof values[key] === "string"
              ? values[key].trim() || null
              : values[key] || null,
        };
      }
    });
    if (Object.keys(customFieldsData).length > 0) {
      input.customFieldsData = JSON.stringify(customFieldsData);
    }

    const result = await client.graphql({
      query: CREATE_BORROWER_MUTATION,
      variables: { input },
    });

    return result.data.createBorrower;
  };

  // API handler for updating borrower
  const handleUpdateBorrowerAPI = async (values, initialValues) => {
    const input = {
      id: initialValues.id,
      firstname: values.firstname?.trim() || null,
      othername: values.othername?.trim() || null,
      businessName: values.businessName?.trim() || null,
      typeOfBusiness: values.typeOfBusiness?.trim() || null,
      uniqueIdNumber: values.uniqueNumber?.trim() || null,
      phoneNumber: values.mobile?.trim() || null,
      otherPhoneNumber: values.altPhone?.trim() || null,
      email: values.email?.trim() || null,
      gender: values.gender || null,
      dateOfBirth: values.dob || null,
      nationality: values.country || null,
      address: values.address?.trim() || null,
      city: values.city?.trim() || null,
      state: values.province?.trim() || null,
      title: values.title || null,
      zipcode: values.zipcode?.trim() || null,
      employmentStatus: values.workingStatus || null,
      employerName: values.employerName?.trim() || null,
      creditScore: values.creditScore?.trim() || null,
    };

    const customFieldsData = {};
    Object.keys(values).forEach((key) => {
      if (key.startsWith("custom_")) {
        const fieldId = key.replace("custom_", "");
        customFieldsData[fieldId] = {
          fieldId,
          value:
            typeof values[key] === "string"
              ? values[key].trim() || null
              : values[key] || null,
        };
      }
    });
    if (Object.keys(customFieldsData).length > 0) {
      input.customFieldsData = JSON.stringify(customFieldsData);
    }

    const result = await client.graphql({
      query: UPDATE_BORROWER_MUTATION,
      variables: { input },
    });

    return result.data.updateBorrower;
  };

  // Custom handleCreateSuccess to update allBorrowers state and show notification
  const handleCreateSuccess = (newBorrower) => {
    setAllBorrowers((prev) => [...prev, newBorrower]);
    const combinedName =
      newBorrower.firstname || newBorrower.othername
        ? `${[newBorrower.firstname, newBorrower.othername]
            .filter(Boolean)
            .join(" ")}${
            newBorrower.businessName ? ` (${newBorrower.businessName})` : ""
          }`
        : newBorrower.businessName || "";
    setNotification({
      message: `${combinedName} created successfully!`,
      color: "green",
    });
    originalHandleCreateSuccess(newBorrower);
  };

  // Custom handleDeleteConfirm to update allBorrowers state and show notification
  const handleDeleteConfirm = async () => {
    try {
      await originalHandleDeleteConfirm();
      // Remove the deleted borrower from allBorrowers state
      if (deleteDialogRow) {
        setAllBorrowers((prev) =>
          prev.filter((borrower) => borrower.id !== deleteDialogRow.id)
        );
        const combinedName =
          deleteDialogRow.firstname || deleteDialogRow.othername
            ? `${[deleteDialogRow.firstname, deleteDialogRow.othername]
                .filter(Boolean)
                .join(" ")}${
                deleteDialogRow.businessName
                  ? ` (${deleteDialogRow.businessName})`
                  : ""
              }`
            : deleteDialogRow.businessName || "";
        setNotification({
          message: `${combinedName} deleted successfully!`,
          color: "green",
        });
      }
    } catch (error) {
      console.error("Error deleting borrower:", error);
    }
  };

  // Custom handleEditSuccess to update the combinedName and show notification
  const handleEditSuccess = (updatedBorrower) => {
    const borrowerWithCombinedName = {
      ...updatedBorrower,
      combinedName:
        updatedBorrower.firstname || updatedBorrower.othername
          ? `${[updatedBorrower.firstname, updatedBorrower.othername]
              .filter(Boolean)
              .join(" ")}${
              updatedBorrower.businessName
                ? ` (${updatedBorrower.businessName})`
                : ""
            }`
          : updatedBorrower.businessName || "",
    };
    setAllBorrowers((prev) =>
      prev.map((borrower) =>
        borrower.id === updatedBorrower.id ? updatedBorrower : borrower
      )
    );
    setNotification({
      message: `${borrowerWithCombinedName.combinedName} updated successfully!`,
      color: "green",
    });
    originalHandleEditSuccess(borrowerWithCombinedName);
  };

  React.useEffect(() => {
    if (userDetails?.branchUsersId && !__borrowersFetchedOnce) {
      __borrowersFetchedOnce = true;
      fetchBorrowers({ branchId: userDetails.branchUsersId });
    }
  }, [userDetails?.branchUsersId, fetchBorrowers]);

  React.useEffect(() => {
    if (allBorrowers && Array.isArray(allBorrowers)) {
      const processed = allBorrowers.map((borrower) => ({
        ...borrower,
        combinedName:
          borrower.firstname || borrower.othername
            ? `${[borrower.firstname, borrower.othername]
                .filter(Boolean)
                .join(" ")}${
                borrower.businessName ? ` (${borrower.businessName})` : ""
              }`
            : borrower.businessName || "",
      }));
      processed.sort((a, b) =>
        a.combinedName.localeCompare(b.combinedName, undefined, {
          sensitivity: "base",
        })
      );
      setProcessedBorrowers(processed);
    }
  }, [allBorrowers]);

  const handleEditClick = (form) => {
    if (form) {
      form.toggleEdit();
      setEditMode(form.getEditMode());
    }
  };

  const handlePopupDeleteClick = () => {
    handleEditDialogClose();
    if (editDialogRow) {
      handleDeleteDialogOpen(editDialogRow);
    }
  };

  const columns = [
    {
      field: "combinedName",
      headerName: "Full Name / Business Name",
      width: 280,
      renderCell: (params) => (
        <ClickableText
          onClick={() => {
            navigate(`/borrowers/${params.row.id}`);
          }}
        >
          {params.value}
        </ClickableText>
      ),
    },
    {
      field: "phoneNumber",
      headerName: "Phone No.",
      width: 140,
    },
    {
      field: "otherPhoneNumber",
      headerName: "Alt. Phone No.",
      width: 140,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 100,
    //   renderCell: (params) =>
    //     params.value
    //       ? params.value.charAt(0).toUpperCase() + params.value.slice(1)
    //       : "",
    // },
  ];

  return (
    <>
      <NotificationBar
        message={notification.message}
        color={notification.color}
      />
      <CollectionsTemplate
        title="Borrowers"
        createButtonText="Create Borrower"
        onCreateClick={handleCreateDialogOpen}
        items={processedBorrowers}
        loading={borrowersLoading}
        columns={columns}
        searchFields={["firstname", "businessName", "phoneNumber", "email"]}
        noDataMessage="No borrowers found. Please create a borrower to get started."
        createDialogOpen={createDialogOpen}
        onCreateDialogClose={handleCreateDialogClose}
        createDialogTitle="Create Borrower"
        CreateFormComponent={CreateBorrower}
        createFormProps={{
          onClose: handleCreateDialogClose,
          onCreateSuccess: handleCreateSuccess,
          onCreateBorrowerAPI: handleCreateBorrowerAPI,
          ref: formRef,
          isEditMode: false,
          setNotification, // pass down if needed
        }}
        editDialogOpen={editDialogOpen}
        editDialogRow={editDialogRow}
        onEditDialogClose={handleEditDialogClose}
        EditFormComponent={CreateBorrower}
        editFormProps={{
          onClose: handleEditDialogClose,
          onEditSuccess: handleEditSuccess,
          onUpdateBorrowerAPI: handleUpdateBorrowerAPI,
          initialValues: editDialogRow,
          isEditMode: true,
          ref: formRef,
          setNotification, // pass down if needed
        }}
        onEditClick={handleEditClick}
        onPopupDeleteClick={handlePopupDeleteClick}
        editMode={editMode}
        deleteDialogOpen={deleteDialogOpen}
        onDeleteDialogClose={handleDeleteDialogClose}
        onDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
        deleteDialogRow={deleteDialogRow}
        enableSearch={true}
        searchPlaceholder="Search borrowers..."
      />
    </>
  );
}
