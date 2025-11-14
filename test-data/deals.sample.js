const DealsSample = [
  {
    userId: '64f1234567890abcdef12345',

    dealId: 'DL-2025-0001',
    title: 'Summer Fashion Campaign',

    brand: {
      name: 'TrendyWear',
      contactPerson: {
        name: 'Riya Sharma',
        email: 'riya.sharma@trendywear.com',
        phone: '9876543210',
        designation: 'Marketing Manager',
      },
      website: 'https://trendywear.com',
      industry: 'fashion',
      companySize: 'medium',
    },

    platform: 'instagram',

    deliverables: [
      {
        type: 'instagram_reel',
        quantity: 2,
        description: 'Two reels showcasing the new summer collection',
        specifications: {
          duration: 30,
          dimensions: '1080x1920',
          hashtags: ['#SummerVibes', '#TrendyWear'],
          mentions: ['@trendywear_official'],
          musicRequired: true,
          locationTagRequired: true,
        },
        deadline: '2025-06-15T00:00:00Z',
        status: 'in_progress',
        submissionUrl: 'https://instagram.com/p/xyz',
        submittedAt: '2025-06-10T00:00:00Z',
        approvedAt: null,
        revisionNotes: 'Add more product close-ups',
        revisionCount: 1,
      },
    ],

    stage: 'negotiating',
    status: 'active',

    dealValue: {
      currency: 'INR',
      amount: 200000,
      breakdown: [
        { description: 'Content Creation', amount: 150000, percentage: 75 },
        { description: 'Promotion', amount: 50000, percentage: 25 },
      ],
      paymentTerms: '50_50',
      customPaymentTerms: null,
      gstApplicable: true,
      tdsApplicable: false,
      gstAmount: 36000,
      tdsAmount: 0,
      finalAmount: 236000,
    },

    timeline: {
      pitchedDate: '2025-05-20T00:00:00Z',
      responseDeadline: '2025-05-25T00:00:00Z',
      negotiationStartDate: '2025-05-23T00:00:00Z',
      contractSignedDate: '2025-05-30T00:00:00Z',
      contentCreationStart: '2025-06-01T00:00:00Z',
      contentDeadline: '2025-06-15T00:00:00Z',
      goLiveDate: '2025-06-20T00:00:00Z',
      campaignEndDate: '2025-07-15T00:00:00Z',
      paymentDueDate: '2025-07-30T00:00:00Z',
      completedDate: null,
    },

    campaignRequirements: {
      exclusivity: {
        required: true,
        duration: 30,
        categories: ['fashion', 'lifestyle'],
      },
      contentGuidelines: {
        mustInclude: ['Brand logo at start', 'Call-to-action'],
        mustAvoid: ['Mentioning competitor brands'],
        tone: 'casual',
        style: 'Colorful and energetic',
      },
      usageRights: {
        duration: '3_months',
        platforms: ['instagram', 'youtube'],
        geography: 'india',
        whiteLabel: false,
      },
      performanceTargets: {
        minViews: 50000,
        minLikes: 5000,
        minComments: 200,
        minShares: 100,
        minSaves: 300,
        ctr: 2.5,
        engagementRate: 8.5,
      },
    },

    communications: [
      {
        type: 'email',
        direction: 'outbound',
        subject: 'Proposal for Summer Campaign',
        summary: 'Shared initial pitch deck with deliverables and budget.',
        outcome: 'follow_up_required',
        nextAction: 'Schedule negotiation call',
        followUpDate: '2025-05-24T00:00:00Z',
        attachments: ['https://files.com/proposal.pdf'],
        createdAt: '2025-05-20T00:00:00Z',
        createdBy: '64f1234567890abcdef99999',
      },
    ],

    internalNotes: 'Client is interested in long-term collaboration if campaign performs well.',
    tags: ['fashion', 'summer', 'instagram'],

    priority: 'high',

    source: 'direct_outreach',
    referralSource: null,

    performance: {
      isTracked: true,
      metricsCollected: [
        {
          platform: 'instagram',
          metric: 'views',
          value: 42000,
          timestamp: '2025-06-22T00:00:00Z',
          screenshotUrl: 'https://files.com/metrics1.png',
        },
      ],
      summary: {
        totalReach: 60000,
        totalImpressions: 75000,
        totalEngagement: 8000,
        avgEngagementRate: 9.2,
        clickThroughs: 1200,
        conversions: 150,
        roi: 2.5,
      },
    },

    contract: {
      isRequired: true,
      status: 'signed',
      contractUrl: 'https://files.com/contracts/deal1.pdf',
      signedAt: '2025-05-30T00:00:00Z',
      expiresAt: '2025-08-30T00:00:00Z',
      keyTerms: {
        exclusivity: '30 days no competitor deals',
        deliverables: '2 Instagram Reels, 1 Story',
        timeline: 'Content by June 15, Go-live June 20',
        payment: '50% upfront, 50% after completion',
        usageRights: '3 months usage across Instagram and YouTube',
        cancellation: '30% cancellation fee if before go-live',
      },
    },

    invoices: ['64f8888888880abcdef11111'],
    assignedManager: '64f7777777770abcdef22222',

    alerts: [
      {
        type: 'deadline_approaching',
        message: 'Content submission deadline in 3 days',
        severity: 'warning',
        isRead: false,
        createdAt: '2025-06-12T00:00:00Z',
      },
    ],

    collaborators: [
      {
        userId: '64f5555555550abcdef33333',
        role: 'editor',
        addedAt: '2025-05-21T00:00:00Z',
      },
    ],

    competitorAnalysis: {
      similarDeals: [
        {
          brand: 'StyleX',
          creator: 'Influencer A',
          platform: 'instagram',
          estimatedValue: 180000,
          deliverables: ['instagram_reel', 'instagram_story'],
          performance: 'Reached 55K users',
          source: 'public_campaign_data',
        },
      ],
      marketRate: {
        min: 150000,
        max: 250000,
        average: 200000,
        lastUpdated: '2025-05-15T00:00:00Z',
      },
    },

    isArchived: false,
    archivedAt: null,
    archivedBy: null,

    isDeleted: false,
    deletedAt: null,
    deletedBy: null,
  },
]
