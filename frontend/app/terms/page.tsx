"use client";

import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Head from "next/head";

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | KiddyJoy</title>
        <meta name="description" content="Terms of Service for KiddyJoy - Your trusted store for premium baby products." />
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
            <Typography color="#EC407A">Terms of Service</Typography>
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
                backgroundClip: "text"
              }}
            >
              Terms of Service
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", maxWidth: "800px", mx: "auto" }}>
              Welcome to KiddyJoy. These Terms of Service govern your use of our website and the purchase of our products. By accessing or using KiddyJoy, you agree to be bound by these terms.
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ maxWidth: "900px", mx: "auto", bgcolor: "#ffffff", p: { xs: 3, md: 5 }, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            
            {/* Acceptance of Terms */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </Typography>
            </Box>

            {/* Use License */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                2. Use License
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                Permission is granted to temporarily download one copy of the materials on KiddyJoy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </Typography>
              <Box component="ul" sx={{ pl: 4, color: "#333" }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">modify or copy the materials;</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">use the materials for any commercial purpose or for any public display;</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">attempt to reverse engineer any software contained on the website;</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body1">remove any copyright or other proprietary notations from the materials.</Typography>
                </Box>
              </Box>
            </Box>

            {/* Products and Services */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                3. Products and Services
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                We strive to be as accurate as possible in the descriptions of our products. However, we do not warrant that product descriptions, colors, information, or other content of the website are accurate, complete, reliable, current, or error-free. All products are subject to availability, and we reserve the right to discontinue any products at any time.
              </Typography>
            </Box>

            {/* Orders and Payment */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                4. Orders and Payment
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. All prices are displayed in [Your Currency] and are inclusive of VAT (where applicable). Payment must be made in full before dispatch of the goods.
              </Typography>
            </Box>

            {/* User Accounts */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                5. User Accounts
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your account. You agree to accept responsibility for all activities that occur under your account or password.
              </Typography>
            </Box>

            {/* Intellectual Property */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                6. Intellectual Property
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                The website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by KiddyJoy, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </Typography>
            </Box>

            {/* Limitation of Liability */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                7. Limitation of Liability
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                In no event shall KiddyJoy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </Typography>
            </Box>

            {/* Governing Law */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                8. Governing Law
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </Typography>
            </Box>

            {/* Changes to Terms */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                9. Changes to Terms of Service
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website following the posting of any changes constitutes acceptance of those changes.
              </Typography>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#EC407A" }}>
                10. Contact Information
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "#333" }}>
                Questions about the Terms of Service should be sent to us at <MuiLink href="mailto:support@kiddyjoy.com" sx={{ color: "#EC407A", fontWeight: "bold" }}>support@kiddyjoy.com</MuiLink>.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}