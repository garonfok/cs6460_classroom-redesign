import { Announcement } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { faker } from '@faker-js/faker';

faker.seed(Number(process.env.RANDOM_SEED));

const seedTeacher = async () => {
  const seedAnnouncements = async (authorId: string) => {
    // const numAnnouncements = faker.number.int({ min: 5, max: 10 });
    // for (let i = 0; i < numAnnouncements; i++) {
    //   const announcement = await prisma.announcement.create({
    //     data: {
    //       dateCreated: faker.date.recent({ days: 30 }),
    //       content: faker.lorem.paragraph(),
    //       authorId: teacherId,
    //     }
    //   });

    //   await prisma.userAnnouncementSeen.create({
    //     data: {
    //       userId: teacher.id,
    //       announcementId: announcement.id,
    //     }
    //   });
    // }
    const announcements: Omit<Announcement,"id">[] = [
      {
        authorId,
        content: `<p>Today, you will be taking a short survey to tell us what you think about our school. There are no right or wrong answers, this is not a test. Your answers give us important information to help our school become even better. Your answers are anonymous, which means no one will know how you responded to the questions. Please read each item carefully and mark one choice for each item. The last two questions are optional and you can provide a short response.&nbsp; Answer all of the questions from your own experience, and only fill the form out once. If you need help reading a question, please raise your hand quietly. This survey may take you about 10-15 minutes. Thank you for taking this survey. You may begin.</p><p><a href="https://docs.google.com/forms/d/e/1FAIpQLSf6TaCFDnhhd27XdSbBCwHYT_Yre3HmyRJPUeVRQ_41iHRrlQ/viewform?usp=dialog&amp;authuser=0">https://docs.google.com/forms/d/e/1FAIpQLSf6TaCFDnhhd27XdSbBCwHYT_Yre3HmyRJPUeVRQ_41iHRrlQ/viewform?usp=dialog&amp;authuser=0</a></p>`,
        dateCreated: new Date("2026-04-22")
      },
      {
        authorId,
        content: `<p>Please listen to Mr. Fok's directions and fill out this survey.</p><p>&nbsp;</p><p><a href="https://forms.gle/G6f8NkAfGWrxLd8D6?authuser=0">https://forms.gle/G6f8NkAfGWrxLd8D6?authuser=0</a></p>`,
        dateCreated: new Date("2026-03-11")
      },
      {
        authorId,
        content: '<p>Please take this Post Test after our Fire Safety and Burn Prevention Assembly <br /><a href="https://docs.google.com/forms/d/1CRlkaAMnfhqmfXbNFNq0631YHaqedtEIK_p2-ua56yM/viewform?edit_requested=true" target="_blank">https://docs.google.com/forms/d/1CRlkaAMnfhqmfXbNFNq0631YHaqedtEIK_p2-ua56yM/viewform?edit_requested=true</a></p>',
        dateCreated: new Date("2026-02-06")
      },
      {
        authorId,
        content: `<p>Today, you will be taking a short survey to tell us what you think about our school. There are no right or wrong answers, this is not a test. Your answers give us important information to help our school become even better. Your answers are anonymous, which means no one will know how you responded to the questions. Please read each item carefully and mark one choice for each item. The last two questions are optional and you can provide a short response.&nbsp; Please answer all of the questions from your own experience. If you need help reading a question, please raise your hand quietly. This survey may take you about 10-15 minutes. Thank you for taking this survey. You may begin.</p><p><a href="https://forms.gle/eDhLyN2neCUQEurK6?authuser=0">https://forms.gle/eDhLyN2neCUQEurK6?authuser=0</a></p>`,
        dateCreated: new Date("2025-08-25")
      }
    ];

    for (const announcement of announcements) {
      const createdAnnouncement = await prisma.announcement.create({
        data: announcement
      });

      await prisma.userAnnouncementSeen.create({
        data: {
          userId: authorId,
          announcementId: createdAnnouncement.id,
        }
      });
    }
  };

  const teacher = await prisma.user.create({
    data: {
      name: "Dena O'Hara",
      isTeacher: true,
    },
  });

  seedAnnouncements(teacher.id);
  const numAnnouncements = faker.number.int({ min: 5, max: 10 });
  for (let i = 0; i < numAnnouncements; i++) {
    prisma.announcement.create({
      data: {
        dateCreated: faker.date.between({ from: new Date("2025-09-01"), to: new Date() }),
        content: faker.lorem.paragraph(),
        authorId: teacher.id,
      }
    });
  }

  seedMaterials(teacher.id);
};

const seedAssignments = async () => {

  await prisma.assignment.create({
    data: {
      title: "Famous Innovative Person Report",
      description: "<p>Use the template provided to type your famous innovator report.&nbsp;<strong> Please keep the Arial, size 16 font, </strong>and make sure that after you type in the title, the rest of the report is not center justified.&nbsp;&nbsp;<br /><br /><strong>Note the bibliography template on the second page as well.&nbsp; This must be filled out.&nbsp;</strong> Please use only the approved websites for your online research.&nbsp; &nbsp;<strong><em>Please Note: Wikipedia is not an approved website.</em></strong><br /><br />Your report should have four paragraphs like your outline, an introduction Paragraph, Body Paragraph 1- Childhood, Body Paragraph 2-Adult Life, and a conclusion paragraph.&nbsp;&nbsp;<br /><br />An example of my Dr. Seuss report is attached.</p>",
      dateDue: new Date("2026-04-02"),
      pointsPossible: 4,
    }
  });

  await prisma.assignment.create({
    data: {
      title: "Animal Research Report",
      description: "<p>Use this template to type and turn in your paragraphs.<br /><br />Using your Animal Research Planning Guides write a <strong>two paragraph report</strong>.<br /><br /><strong>Paragraph 1</strong> - The first paragraph will be an introduction. It will include interesting facts about your animal.<br /><br /><strong>Paragraph 2</strong> - The second paragraph is the adaptation paragraph. It should include at least two structural adaptations that help your animal survive in its environment. It must be in the paragraph driving format. Each adaptation is a yellow detail with at least two red details to support it.<br /><br /><strong>Bibliography</strong> - At the bottom of the page is a template to cite the sources you used, at least one book and one website. <strong>Follow Template.&nbsp; Do not delete!&nbsp;&nbsp;</strong><br /><br />Note: After you have completed the two paragraphs, you must reread and revise using CAPS. (Capitalization, All Sentences Make Sense, Punctuation, Spelling. See the bottom of the Paragraph Driving Checklist.) The font must stay at <strong>Arial, Size 16 with no bold, italics or highlighting.&nbsp;&nbsp;</strong><br /><br /><strong>I have also attached my example and a student sample of the report for your reference.</strong></p>",
      dateDue: new Date("2026-01-09"),
      pointsPossible: 4,
    }
  });
}

const seedMaterials = async (teacherId: string) => {
  await prisma.material.create({
    data: {
      title: "Famous Innovative Person Presentation Notes",
      description: "Attached are the notes students can use to prepare for their presentation.  Notes on Index Cards are highly encouraged.",
      category: "Famous Innovative Person Report",
      authorId: teacherId,
    }
  });

  await prisma.material.create({
    data: {
      title: "Websites for Famous Innovative Person Project",
      description: "<p>Here are links to safe websites for the Famous Innovative Person Report.<br /><br />Make sure your research comes from reliable websites.<br /><br />Remember to ignore ads or any sites that asks for a subscription.</p>",
      category: "Famous Innovative Person Report",
      authorId: teacherId,
    }
  });


  await prisma.material.create({
    data: {
      title: "Spelling Form #5",
      description: "Fill out the Spelling Inventory.",
      category: "Spelling Inventories",
      authorId: teacherId,
    }
  });

  await prisma.material.create({
    data: {
      title: "Animal Report Presentation Expectations",
      description: "Attached is the schedule for the animal report presentations next week. A template for presentation notes is also included as well as the  expectations for the presentation.  Use the note template as a guide, but I encourage index cards with just a few bullet points on each card.",
      category: "Animal Research Report",
      authorId: teacherId,
    }
  });

  await prisma.material.create({
    data: {
      title: "Animal Report Poster Expectations",
      description: "<p>Your poster should include all of the expectations.&nbsp; Construction paper was provided.&nbsp;&nbsp;<br /><br />ANIMAL REPORT POSTER EXPECTATIONS<br />Your animal report poster should have the following:&nbsp;</p><ul><li>Hand drawn picture of your animal&nbsp;</li><li>Background information/details about your animal&nbsp;</li><li>Specific adaptations your animal has&nbsp;</li><li>HOW those adaptations help your animal&nbsp;</li><li>Neatly done, easy to read, uses the whole space</li><li>Colorful, your best effort</li></ul>",
      category: "Animal Research Report",
      authorId: teacherId,
    }
  });

  await prisma.material.create({
    data: {
      title: "Animal Report Planning Guides/Outlines",
      description: "<p>Attached are the templates and my African Elephant examples for the animal research planning guides/outlines.&nbsp;<br /><br /><br />One outline is for the Introduction Paragraph.&nbsp; The other is for the adaptation paragraph.&nbsp; The outlines are used to organize the notes you haven taken from your book and website.&nbsp;&nbsp;<br /><br /><br />For the introduction paragraph, choose interesting facts to introduce your animal.&nbsp;&nbsp;<br /><br /><br />For the adaptation paragraph, choose <strong>two</strong> adaptations and include notes from your book about these adaptations, then from the website.<br /><br />Remember to cite your sources.&nbsp; For the book, you need the title, author, and page numbers used for your research. For&nbsp;the website, you need to copy the URL or internet address and author, if available.</p>",
      category: "Animal Research Report",
      authorId: teacherId,
    }
  });

  await prisma.material.create({
    data: {
      title: "Websites for Animal Research Report",
      description: `<p>Here are links to safe websites for the Animal Research Report:<br /><br /><br /><a href="https://school.eb.com/levels/elementary" target="_blank">https://school.eb.com/levels/elementary</a>&nbsp;<br /><br /><br /><a href="https://kids.nationalgeographic.com/" target="_blank">https://kids.nationalgeographic.com/</a><br /><br /><br /><a href="https://www.timeforkids.com/k1/sections/animals/" target="_blank">https://www.timeforkids.com/k1/sections/animals/</a><br /><br /><br /><br /><a href="https://www.safesearchkids.com/google-kids/#.YakJV2ZKikp" target="_blank">https://www.safesearchkids.com/google-kids/#.YakJV2ZKikp</a></p>`,
      category: "Animal Research Report",
      authorId: teacherId,
    }
  });
}

const seed = async () => {
  await prisma.telemetryEvent.deleteMany();
  await prisma.userAnnouncementSeen.deleteMany();
  await prisma.userAssignmentGradeSeen.deleteMany();
  await prisma.userAssignmentGrade.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.material.deleteMany();
  await prisma.announcementComment.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.user.deleteMany();

  await seedTeacher();
  await seedAssignments();
};

seed();
