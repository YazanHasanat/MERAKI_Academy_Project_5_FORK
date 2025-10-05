"use client";

import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Head from "next/head";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | KiddyJoy</title>
        <meta
          name="description"
          content="Privacy Policy for KiddyJoy - Your trusted store for premium baby products."
        />
      </Head>

      <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh", py: 6 }}>
        <Container maxWidth="lg">
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <MuiLink underline="hover" color="inherit" href="/">
              Home
            </MuiLink>
            <Typography color="#EC407A">Privacy Policy</Typography>
          </Breadcrumbs>

          {/* Header */}
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                background: "linear-gradient(45deg, #EC407A, #7E57C2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#666", maxWidth: "800px", mx: "auto" }}
            >
              At KiddyJoy, we value your privacy and are committed to protecting
              your personal information. This policy outlines how we collect,
              use, and safeguard your data when you use our website.
            </Typography>
          </Box>

          {/* Content */}
          <Box
            sx={{
              maxWidth: "900px",
              mx: "auto",
              bgcolor: "#ffffff",
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Introduction */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                1. Introduction
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                Welcome to KiddyJoy. Your privacy is important to us. This
                Privacy Policy explains what information we collect from you,
                how we use it, and the steps we take to protect it. By using
                KiddyJoy, you agree to the collection and use of information in
                accordance with this policy.
              </Typography>
            </Box>

            {/* Information We Collect */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                2. Information We Collect
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333", mb: 2 }}
              >
                We may collect several types of information to provide and
                improve our services to you:
              </Typography>
              <Box component="ul" sx={{ pl: 4, color: "#333" }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Personal Information:</strong> Name, shipping
                    address, billing address, email address, phone number, and
                    payment details when you make a purchase.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Account Information:</strong> If you create an
                    account, we store your username, password (encrypted), and
                    purchase history.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    <strong>Local Storage:</strong> We use browser local storage
                    to store small amounts of data on your device. This helps us
                    remember your session and preferences, such as your login
                    status, to provide a more seamless experience.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* How We Use Your Information */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                3. How We Use Your Information
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333", mb: 2 }}
              >
                KiddyJoy uses the collected information for various purposes:
              </Typography>
              <Box component="ul" sx={{ pl: 4, color: "#333" }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    To process and fulfill your orders.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    To provide customer support and respond to your inquiries.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    To personalize your experience and provide relevant content.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    To send you transactional emails and, with your consent,
                    marketing newsletters.
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    To detect, prevent, and address technical issues.
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Data Security */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                4. Data Security
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                We implement a variety of security measures to maintain the
                safety of your personal information. Your data is stored on
                secure servers and protected by industry-standard encryption
                protocols (like SSL) for data transmission. However, no method
                of transmission over the Internet is 100% secure, and we cannot
                guarantee absolute security.
              </Typography>
            </Box>

            {/* Your Rights */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                5. Your Rights
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                You have the right to access, update, or delete your personal
                information. You can manage your account details through your
                online account or by contacting us directly. You may also
                opt-out of marketing communications at any time by clicking the
                "unsubscribe" link in our emails.
              </Typography>
            </Box>

            {/* Children's Privacy */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                6. Children's Privacy
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                Our website is not intended for use by children under the age of
                13. We do not knowingly collect personally identifiable
                information from children under 13. If you are a parent or
                guardian and you are aware that your child has provided us with
                personal information, please contact us.
              </Typography>
            </Box>

            {/* Changes to This Policy */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                7. Changes to This Privacy Policy
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date at the bottom.
                You are advised to review this Privacy Policy periodically for
                any changes.
              </Typography>
            </Box>

            {/* Contact Us */}
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}
              >
                8. Contact Us
              </Typography>
              <Typography
                variant="body1"
                sx={{ lineHeight: 1.8, color: "#333" }}
              >
                If you have any questions about this Privacy Policy, please
                contact us:
              </Typography>
              <Box sx={{ mt: 2, pl: 2 }}>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  By visiting our{" "}
                  <MuiLink
                    href="/contactus"
                    sx={{ color: "#EC407A", fontWeight: "bold" }}
                  >
                    Contact Us page
                  </MuiLink>
                  .
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  By email: privacy@kiddyjoy.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
