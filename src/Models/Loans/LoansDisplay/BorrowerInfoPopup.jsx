import React from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useTheme } from "@mui/material/styles";
import ClickableText from "../../../ModelAssets/ClickableText";

const CLOSE_DELAY = 140;

const getBorrowerName = (borrower) =>
  [borrower?.firstname, borrower?.othername, borrower?.businessName]
    .filter(Boolean)
    .join(" ") || "Unknown";

export default function BorrowerInfoPopup({
  borrower,
  displayName,
  onNavigate,
}) {
  const theme = useTheme();
  const sf = theme.palette.sf;
  const anchorRef = React.useRef(null);
  const closeTimerRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const clearCloseTimer = React.useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPopup = React.useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const closePopup = React.useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = React.useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, CLOSE_DELAY);
  }, [clearCloseTimer]);

  React.useEffect(
    () => () => {
      clearCloseTimer();
    },
    [clearCloseTimer],
  );

  const handleTriggerClick = React.useCallback(
    (event) => {
      event.stopPropagation();
      clearCloseTimer();
      setOpen((prev) => !prev);
    },
    [clearCloseTimer],
  );

  const handleNavigate = React.useCallback(
    (event) => {
      event.stopPropagation();
      closePopup();
      onNavigate?.();
    },
    [closePopup, onNavigate],
  );

  return (
    <ClickAwayListener onClickAway={closePopup}>
      <Box
        sx={{
          display: "block",
          width: "100%",
          lineHeight: 1,
        }}
      >
        <Typography
          component="span"
          ref={anchorRef}
          onMouseEnter={openPopup}
          onMouseLeave={scheduleClose}
          onClick={handleTriggerClick}
          sx={{
            display: "inline-block",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: sf.sf_textLink,
            cursor: "pointer",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: 1.2,
            verticalAlign: "top",
            m: 0,
            p: 0,
            textDecoration: "underline",
            "&:hover": {
              color: sf.sf_textLinkHover,
            },
          }}
        >
          {displayName}
        </Typography>

        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 6],
              },
            },
          ]}
        >
          <Paper
            elevation={3}
            onMouseEnter={openPopup}
            onMouseLeave={scheduleClose}
            sx={{
              px: 1.25,
              py: 1,
              minWidth: 220,
              maxWidth: 280,
              borderRadius: 0,
              border: `1px solid ${sf.sf_borderLight}`,
              boxShadow: sf.sf_shadowMd,
              bgcolor: sf.sf_cardBg || sf.sf_background || "background.paper",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.45 }}>
              <ClickableText
                onClick={handleNavigate}
                sx={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: sf.sf_textLink,
                  lineHeight: 1.25,
                }}
              >
                {getBorrowerName(borrower)}
              </ClickableText>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <PhoneOutlinedIcon
                  sx={{
                    fontSize: 14,
                    color: sf.sf_textSecondary || sf.sf_textTertiary,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: sf.sf_textSecondary || sf.sf_textTertiary,
                    lineHeight: 1.25,
                  }}
                >
                  {borrower?.phoneNumber || "No phone"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <EmailOutlinedIcon
                  sx={{
                    fontSize: 14,
                    color: sf.sf_textSecondary || sf.sf_textTertiary,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: "0.72rem",
                    color: sf.sf_textSecondary || sf.sf_textTertiary,
                    lineHeight: 1.25,
                    wordBreak: "break-word",
                  }}
                >
                  {borrower?.email || "No email"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
