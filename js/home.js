function getRadioValue(form, name) {
      var el = form.querySelector('input[name="' + name + '"]:checked');
      return el ? el.value : "";
    }

    function validateRadioGroups(form, groupNames) {
      var allValid = true;
      var firstInvalid = null;
      groupNames.forEach(function (name) {
        var input = form.querySelector('input[name="' + name + '"]');
        var checked = form.querySelector('input[name="' + name + '"]:checked');
        var fieldset = input ? input.closest("fieldset") : null;
        if (!checked) {
          allValid = false;
          if (fieldset) {
            fieldset.style.outline = "2px solid #ef4444";
            fieldset.style.outlineOffset = "4px";
            fieldset.style.borderRadius = "14px";
            if (!firstInvalid) firstInvalid = fieldset;
          }
        } else if (fieldset) {
          fieldset.style.outline = "";
        }
      });
      if (firstInvalid) {
        /* Accordion: open the first unanswered question so the user can see it, collapse the rest */
        groupNames.forEach(function (name) {
          var input = form.querySelector('input[name="' + name + '"]');
          var fs = input ? input.closest(".quiz-field") : null;
          if (!fs) return;
          var header = fs.querySelector(".quiz-field__header");
          if (fs === firstInvalid) {
            fs.classList.add("is-open");
            if (header) header.setAttribute("aria-expanded", "true");
          } else {
            fs.classList.remove("is-open");
            if (header) header.setAttribute("aria-expanded", "false");
          }
        });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return allValid;
    }

    /* Turns each set of qualifying questions into an accordion:
       one question open at a time, auto-advances to the next after an answer is picked. */
    function initQuizAccordion(formId, groupNames) {
      var form = document.getElementById(formId);
      if (!form) return;

      var items = groupNames.map(function (name) {
        var input = form.querySelector('input[name="' + name + '"]');
        return input ? input.closest(".quiz-field") : null;
      });

      function closeAll() {
        items.forEach(function (fs) {
          if (!fs) return;
          fs.classList.remove("is-open");
          var header = fs.querySelector(".quiz-field__header");
          if (header) header.setAttribute("aria-expanded", "false");
        });
      }

      function openItem(fs) {
        if (!fs) return;
        closeAll();
        fs.classList.add("is-open");
        var header = fs.querySelector(".quiz-field__header");
        if (header) header.setAttribute("aria-expanded", "true");
      }

      items.forEach(function (fs, idx) {
        if (!fs) return;
        var header = fs.querySelector(".quiz-field__header");
        var answerEl = fs.querySelector(".quiz-field__answer");

        if (header) {
          header.addEventListener("click", function () {
            if (fs.classList.contains("is-open")) {
              fs.classList.remove("is-open");
              header.setAttribute("aria-expanded", "false");
            } else {
              openItem(fs);
            }
          });
        }

        var radios = fs.querySelectorAll('input[type="radio"]');
        radios.forEach(function (radio) {
          radio.addEventListener("change", function () {
            fs.classList.add("is-answered");
            if (answerEl) answerEl.textContent = radio.value;
            var next = items[idx + 1];
            setTimeout(function () {
              if (next) {
                openItem(next);
                next.scrollIntoView({ behavior: "smooth", block: "center" });
              } else {
                fs.classList.remove("is-open");
                if (header) header.setAttribute("aria-expanded", "false");
              }
            }, 260);
          });
        });
      });

      if (items[0]) openItem(items[0]);
    }

    function resetQuizAccordion(formId, groupNames) {
      var form = document.getElementById(formId);
      if (!form) return;
      var items = groupNames.map(function (name) {
        var input = form.querySelector('input[name="' + name + '"]');
        return input ? input.closest(".quiz-field") : null;
      });
      items.forEach(function (fs, idx) {
        if (!fs) return;
        fs.classList.remove("is-answered");
        fs.style.outline = "";
        var header = fs.querySelector(".quiz-field__header");
        var answerEl = fs.querySelector(".quiz-field__answer");
        if (answerEl) answerEl.textContent = "";
        if (idx === 0) {
          fs.classList.add("is-open");
          if (header) header.setAttribute("aria-expanded", "true");
        } else {
          fs.classList.remove("is-open");
          if (header) header.setAttribute("aria-expanded", "false");
        }
      });
    }

    (function () {
      var GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSeuFBMI1v-zEHZpEVw_YA1qRP7WGmPOdaGY8KEkToEZKVrpEA/formResponse";
      var PHONE_DIGITS_ONLY = /^\d+$/;
      var EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      function showMessage(msg) { window.alert(msg); }

      var thankModal = document.getElementById("thankYouModal");
      var thankBackdrop = document.getElementById("thankYouModalBackdrop");
      var thankClose = document.getElementById("thankYouModalClose");

      function openThankModal() {
        if (!thankModal) return;
        thankModal.removeAttribute("hidden");
        document.body.classList.add("modal-open");
        if (thankClose) thankClose.focus();
      }

      function closeThankModal() {
        if (!thankModal) return;
        thankModal.setAttribute("hidden", "");
        document.body.classList.remove("modal-open");
      }

      if (thankClose) thankClose.addEventListener("click", closeThankModal);
      if (thankBackdrop) thankBackdrop.addEventListener("click", closeThankModal);

      function setSubmitLoading(button, loading) {
        if (!button) return;
        button.classList.toggle("is-loading", loading);
        button.setAttribute("aria-busy", loading ? "true" : "false");
        button.disabled = loading;
      }

      function hideError(el) { if (el) { el.textContent = ""; el.setAttribute("hidden", ""); } }
      function showError(el, message) { if (el) { el.textContent = message; el.removeAttribute("hidden"); } }

      function clearFormErrors(nameEl, phoneEl, emailEl, nameErr, phoneErr, emailErr) {
        hideError(nameErr); hideError(phoneErr); hideError(emailErr);
        if (nameEl) nameEl.removeAttribute("aria-invalid");
        if (phoneEl) phoneEl.removeAttribute("aria-invalid");
        if (emailEl) emailEl.removeAttribute("aria-invalid");
      }

      function validateLead(nameRaw, phoneRaw, emailRaw, nameEl, phoneEl, emailEl, nameErr, phoneErr, emailErr) {
        var name = (nameRaw || "").trim();
        var phone = (phoneRaw || "").trim();
        var email = (emailRaw || "").trim();
        var ok = true;

        clearFormErrors(nameEl, phoneEl, emailEl, nameErr, phoneErr, emailErr);

        if (name.length < 3) {
          showError(nameErr, name.length === 0 ? "Please enter your name." : "Name must be at least 3 characters.");
          if (nameEl) nameEl.setAttribute("aria-invalid", "true");
          ok = false;
        }

        if (phone.length === 0) {
          showError(phoneErr, "Please enter your phone number.");
          if (phoneEl) phoneEl.setAttribute("aria-invalid", "true");
          ok = false;
        } else if (!PHONE_DIGITS_ONLY.test(phone)) {
          showError(phoneErr, "Phone must contain only numbers.");
          if (phoneEl) phoneEl.setAttribute("aria-invalid", "true");
          ok = false;
        } else if (phone.length < 7) {
          showError(phoneErr, "Please enter at least 7 digits.");
          if (phoneEl) phoneEl.setAttribute("aria-invalid", "true");
          ok = false;
        }

        if (email.length > 0 && !EMAIL_FORMAT.test(email)) {
          showError(emailErr, "Please enter a valid email address.");
          if (emailEl) emailEl.setAttribute("aria-invalid", "true");
          ok = false;
        }

        return ok;
      }

      function wireLeadForm(formId, nameId, phoneId, emailId, questionGroups) {
        var form = document.getElementById(formId);
        if (!form) return;

        var nameEl = document.getElementById(nameId);
        var phoneEl = document.getElementById(phoneId);
        var emailEl = document.getElementById(emailId);
        var nameErr = document.getElementById(nameId + "-error");
        var phoneErr = document.getElementById(phoneId + "-error");
        var emailErr = document.getElementById(emailId + "-error");

        function toggleFormState(disabled) {
          var inputs = [nameEl, phoneEl, emailEl];
          inputs.forEach(function (input) {
            if (input) {
              input.disabled = disabled;
              if (disabled) {
                input.style.backgroundColor = "#e5e7eb";
                input.style.color = "#9ca3af";
                input.style.cursor = "not-allowed";
                input.style.borderColor = "#d1d5db";
              } else {
                input.style.backgroundColor = "";
                input.style.color = "";
                input.style.cursor = "";
                input.style.borderColor = "";
              }
            }
          });

          var submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = disabled;
            if (disabled) {
              submitBtn.style.backgroundColor = "#9ca3af";
              submitBtn.style.borderColor = "#9ca3af";
              submitBtn.style.color = "#ffffff";
              submitBtn.style.cursor = "not-allowed";
              submitBtn.style.boxShadow = "none";
              submitBtn.style.transform = "none";
            } else {
              submitBtn.style.backgroundColor = "";
              submitBtn.style.borderColor = "";
              submitBtn.style.color = "";
              submitBtn.style.cursor = "";
              submitBtn.style.boxShadow = "";
              submitBtn.style.transform = "";
            }
          }
        }

        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var name = nameEl ? nameEl.value : "";
          var phone = phoneEl ? phoneEl.value : "";
          var email = emailEl ? emailEl.value : "";

          if (questionGroups && questionGroups.length && !validateRadioGroups(form, questionGroups)) {
            return;
          }

          if (!validateLead(name, phone, email, nameEl, phoneEl, emailEl, nameErr, phoneErr, emailErr)) {
            toggleFormState(false);
            return;
          }

          var submitBtn = form.querySelector('button[type="submit"]');
          setSubmitLoading(submitBtn, true);
          toggleFormState(true);

          var q1 = questionGroups ? getRadioValue(form, questionGroups[0]) : "";
          var q2 = questionGroups ? getRadioValue(form, questionGroups[1]) : "";
          var q3 = questionGroups ? getRadioValue(form, questionGroups[2]) : "";
          var q4 = questionGroups ? getRadioValue(form, questionGroups[3]) : "";

          var params = new URLSearchParams();
          params.append("entry.2007658999", name.trim());
          params.append("entry.1341104541", phone.trim());
          params.append("entry.1004741489", email.trim());
          // TODO: replace these placeholder entry IDs with the real ones from your
          // Google Form once you add the 4 qualifying questions to it (Form > ⋮ > Get pre-filled link).
          params.append("entry.QUESTION1_REASON", q1);
          params.append("entry.QUESTION2_EXPERIENCE", q2);
          params.append("entry.QUESTION3_TIMELINE", q3);
          params.append("entry.QUESTION4_BUDGET", q4);

          fetch(GOOGLE_FORM_ACTION, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          })
            .then(function () {
              if (submitBtn) {
                submitBtn.classList.remove("is-loading");
                submitBtn.setAttribute("aria-busy", "false");
              }
              
              form.reset();
              clearFormErrors(nameEl, phoneEl, emailEl, nameErr, phoneErr, emailErr);
              form.querySelectorAll(".quiz-field").forEach(function (fs) { fs.style.outline = ""; });
              resetQuizAccordion(formId, questionGroups);
              
              if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                  'send_to': 'AW-16499475514/QVraCJrchuIcELqlyLs9',
                  'value': 1.0,
                  'currency': 'PKR'
                });
              }

              var leadUniqueId = 'lead_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

              window.dataLayer = window.dataLayer || [];
              window.dataLayer.push({
                'event': 'generate_lead',
                'eventId': leadUniqueId,
                'user_data': {
                  'email': email.trim(),
                  'phone': phone.trim(),
                  'name': name.trim()
                },
                'qualifying_answers': {
                  'reason': q1,
                  'experience': q2,
                  'timeline': q3,
                  'budget_ready': q4
                }
              });

              if (typeof fbq === 'function') {
                fbq('track', 'Lead', {
                  content_name: 'Ecom Mentorship',
                  currency: 'PKR',
                  value: 4500
                }, { eventID: leadUniqueId });
              }

              openThankModal();
            })
            .catch(function () {
              toggleFormState(false);
              setSubmitLoading(submitBtn, false);
              showMessage("Something went wrong. Please try again.");
            });
        });
      }

      // Pay Now Button Tracking — disabled (initiate_checkout event should not fire on click)

    })();

    const parseBunnyPlaceholder = id => {
        if (!id?.startsWith("bunny:")) return null;
        const [libraryId, videoId] = id.slice(6).split("/");
        return libraryId && videoId ? { libraryId, videoId } : null;
    };
    const bunnyPlaceholderSrc = (libraryId, videoId, { autoplay, muted }) => {
        const params = new URLSearchParams({
            autoplay: autoplay ? "true" : "false",
            loop: "false",
            muted: muted ? "true" : "false",
            preload: autoplay ? "true" : "false",
            responsive: "true",
        });
        return `https://player.mediadelivery.net/embed/${libraryId}/${videoId}?${params}`;
    };
    const embedBunnyInPlaceholder = (el, autoplay, muted) => {
        const bunny = parseBunnyPlaceholder(el.dataset.video);
        if (!bunny) return false;
        const src = bunnyPlaceholderSrc(bunny.libraryId, bunny.videoId, { autoplay, muted });
        el.innerHTML = `<iframe src="${src}" title="Student story" loading="lazy" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowfullscreen="true"></iframe>`;
        return true;
    };
    const testiPlayMarkup = `<span class="testi__play" aria-hidden="true"><span class="lec__thumb-play">▶</span></span>`;
    const prependStoryThumb = (el) => {
        const id = el.dataset.video;
        const bunny = parseBunnyPlaceholder(id);
        const customThumb = el.dataset.thumb;
        if (el.querySelector("img, iframe")) return;
        if (customThumb) {
            const thumb = document.createElement("img");
            thumb.src = customThumb;
            thumb.alt = "";
            thumb.loading = "lazy";
            el.prepend(thumb);
        } else if (id && !bunny) {
            const thumb = document.createElement("img");
            thumb.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            thumb.alt = "";
            thumb.loading = "lazy";
            el.prepend(thumb);
        }
    };
    const playStoryMedia = (el, { replace = false, muted = false } = {}) => {
        const videoId = el.dataset.video;
        if (!videoId) return;
        const bunny = parseBunnyPlaceholder(videoId);
        const iframe = el.querySelector("iframe");
        if (iframe) {
            if (!replace && bunny && iframe.src.includes(bunny.videoId)) return;
            if (!replace && !bunny) return;
            el.innerHTML = "";
        }
        if (embedBunnyInPlaceholder(el, true, muted)) return;
        el.innerHTML = `
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                    title="Course Video" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            `;
    };
    const setFeaturedStoryMedia = (featuredMedia, sourceMedia, { autoplay } = {}) => {
        featuredMedia.dataset.video = sourceMedia.dataset.video || "";
        if (sourceMedia.dataset.thumb) featuredMedia.dataset.thumb = sourceMedia.dataset.thumb;
        else delete featuredMedia.dataset.thumb;
        if (autoplay && featuredMedia.dataset.video) {
            playStoryMedia(featuredMedia, { replace: true, muted: false });
            return;
        }
        featuredMedia.innerHTML = testiPlayMarkup;
        prependStoryThumb(featuredMedia);
    };

    function initMobileTestiGallery() {
        const track = document.getElementById("mTestiTrack");
        if (!track) return;
        const cards = [...track.querySelectorAll(".m-testi__card")];
        const featuredCard = cards[0];
        const featuredMedia = featuredCard?.querySelector(".m-testi__media");
        const featuredBody = featuredCard?.querySelector(".m-testi__body");
        if (!featuredMedia || !featuredBody) return;

        const selectStory = (card, autoplay) => {
            const media = card.querySelector(".m-testi__media");
            const body = card.querySelector(".m-testi__body");
            if (!media) return;
            const storyVideo = media.getAttribute("data-video");
            if (storyVideo) {
                featuredBody.innerHTML = body.innerHTML;
                setFeaturedStoryMedia(featuredMedia, media, { autoplay });
                cards.forEach((c) => c.classList.toggle("is-story-active", c === card));
                if (autoplay) {
                    featuredCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
                return;
            }
            if (autoplay) playStoryMedia(featuredMedia, { replace: true, muted: false });
        };

        cards.forEach((card) => {
            const media = card.querySelector(".m-testi__media");
            if (media) prependStoryThumb(media);
        });

        track.addEventListener("click", (e) => {
            if (e.target.closest("iframe")) return;
            const card = e.target.closest(".m-testi__card");
            if (!card || !track.contains(card)) return;
            const media = e.target.closest(".m-testi__media");
            if (!media || !card.contains(media)) return;
            if (media.dataset.static === "true") return;
            if (card === featuredCard) {
                playStoryMedia(featuredMedia, { muted: false });
                return;
            }
            const storyVideo = media.getAttribute("data-video");
            const storyThumb = media.getAttribute("data-thumb");
            if (!storyVideo && !storyThumb) return;
            selectStory(card, true);
        });

        cards[0]?.classList.add("is-story-active");
    }

    // YouTube / Bunny lazy load (lecture player uses its own embed logic)
    document.querySelectorAll(".youtube-placeholder:not(.lec__media)").forEach(el => {
        if (el.closest("#mTestiTrack")) return;
        prependStoryThumb(el);
        el.addEventListener("click", function () {
            playStoryMedia(this);
        });
    });
    initMobileTestiGallery();

    document.querySelectorAll(".lec").forEach(section => {
        const player = section.querySelector(".lec__player");
        const media = section.querySelector(".lec__media");
        const nowTitle = section.querySelector(".lec__now-title");
        const buttons = [...section.querySelectorAll(".lec__btn")];
        const youtubeThumbUrl = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        const parseBunny = id => {
            if (!id?.startsWith("bunny:")) return null;
            const [libraryId, videoId] = id.slice(6).split("/");
            return libraryId && videoId ? { libraryId, videoId } : null;
        };
        const bunnyEmbedSrc = (libraryId, videoId, autoplay) => {
            const params = new URLSearchParams({
                autoplay: autoplay ? "true" : "false",
                loop: "false",
                muted: "false",
                preload: autoplay ? "true" : "false",
                responsive: "true",
            });
            return `https://player.mediadelivery.net/embed/${libraryId}/${videoId}?${params}`;
        };
        const lecturePosterUrl = (btn, id) => {
            if (!id) return "";
            if (btn.dataset.thumb) return btn.dataset.thumb;
            if (parseBunny(id)) return "";
            return youtubeThumbUrl(id);
        };
        const renderBunnyIframe = (btn, libraryId, videoId, autoplay) => {
            const title = btn.dataset.title || "Course Video";
            const src = bunnyEmbedSrc(libraryId, videoId, autoplay);
            return `<iframe src="${src}" title="${title}" loading="eager" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;" allowfullscreen="true"></iframe>`;
        };

        const select = (btn, autoplay) => {
            const id = btn.dataset.video;
            const bunny = parseBunny(id);
            buttons.forEach(b => {
                const active = b === btn;
                b.classList.toggle("is-active", active);
                b.setAttribute("aria-pressed", active);
            });
            nowTitle.textContent = btn.dataset.title;
            media.dataset.video = id;
            if (!id) {
                media.classList.remove("is-playing");
                media.innerHTML = `<div class="play-button" aria-hidden="true">▶</div>`;
                return;
            }
            if (autoplay) {
                media.classList.add("is-playing");
                if (bunny) {
                    media.innerHTML = renderBunnyIframe(btn, bunny.libraryId, bunny.videoId, true);
                } else {
                    media.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="${btn.dataset.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                }
                return;
            }
            if (bunny) {
                media.classList.add("is-playing");
                media.innerHTML = renderBunnyIframe(btn, bunny.libraryId, bunny.videoId, false);
                return;
            }
            media.classList.remove("is-playing");
            media.innerHTML = `<div class="play-button" aria-hidden="true">▶</div>`;
        };

        buttons.forEach(btn => {
            const id = btn.dataset.video;
            const poster = lecturePosterUrl(btn, id);
            if (poster) {
                const thumb = btn.querySelector(".lec__thumb");
                thumb.style.backgroundImage = `url(${poster})`;
                thumb.style.backgroundSize = "cover";
                thumb.style.backgroundPosition = "center";
            }
            btn.addEventListener("click", (e) => {
                const playFromThumb = !!e.target.closest(".lec__thumb");
                select(btn, playFromThumb);
                const top = player.getBoundingClientRect().top;
                if (top < 72 || top > window.innerHeight * 0.5) {
                    player.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            });
        });

        media.addEventListener("click", (e) => {
            if (e.target.closest("iframe")) return;
            const active = buttons.find(b => b.classList.contains("is-active"));
            if (!active?.dataset.video) return;
            if (parseBunny(active.dataset.video) && media.querySelector("iframe")) {
                select(active, true);
                return;
            }
            if (!media.querySelector("iframe")) select(active, true);
        });

        if (buttons[0]) select(buttons[0], false);
    });

    // Student Stories carousel dots
    function initStoryCarousel(trackId, dotsId, prevId, nextId) {
        const track = document.getElementById(trackId);
        const dotsWrap = document.getElementById(dotsId);
        if (!track || !dotsWrap) return;
        const cards = [...track.children];
        const dots = cards.map(() => dotsWrap.appendChild(document.createElement("span")));
        const prev = prevId && document.getElementById(prevId);
        const next = nextId && document.getElementById(nextId);
        const setActive = () => {
            const start = cards[0].offsetLeft;
            const maxScroll = track.scrollWidth - track.clientWidth - 1;
            let active = 0;
            if (track.scrollLeft >= maxScroll) {
                active = cards.length - 1;
            } else {
                cards.forEach((card, i) => {
                    const dist = Math.abs(card.offsetLeft - start - track.scrollLeft);
                    if (dist < Math.abs(cards[active].offsetLeft - start - track.scrollLeft)) active = i;
                });
            }
            dots.forEach((d, i) => d.classList.toggle("is-active", i === active));
            track.classList.toggle("is-at-end", track.scrollLeft >= maxScroll);
            if (prev) prev.disabled = track.scrollLeft <= 1;
            if (next) next.disabled = track.scrollLeft >= maxScroll;
        };
        const step = (dir) => {
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            track.scrollBy({ left: dir * (cards[0].offsetWidth + gap), behavior: "smooth" });
        };
        if (prev) prev.addEventListener("click", () => step(-1));
        if (next) next.addEventListener("click", () => step(1));
        track.addEventListener("scroll", setActive, { passive: true });
        window.addEventListener("resize", setActive);
        setActive();
    }
    initStoryCarousel("mTestiTrack", "mTestiDots");
    initStoryCarousel("dTestiTrack", "dTestiDots", "dTestiPrev", "dTestiNext");

    (function () {
      var headers = document.querySelectorAll(".m-header, .d-nav");
      var onScroll = function () {
        var scrolled = window.scrollY > 8;
        headers.forEach(function (header) {
          header.classList.toggle("is-scrolled", scrolled);
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    })();

    (function () {
      var pairs = [
        {
          header: document.querySelector("#layout-mobile .m-header"),
          hero: document.querySelector("#layout-mobile .m-hero"),
        },
      ];

      var syncHeroHeader = function () {
        pairs.forEach(function (pair) {
          if (!pair.header || !pair.hero) return;
          var pastHero = pair.hero.getBoundingClientRect().bottom <= 0;
          pair.header.classList.toggle("is-past-hero", pastHero);
        });
      };

      syncHeroHeader();
      window.addEventListener("scroll", syncHeroHeader, { passive: true });
      window.addEventListener("resize", syncHeroHeader);
    })();

    document.querySelectorAll("[data-highlight-enroll]").forEach(btn => {
        btn.addEventListener("click", e => {
            const layout = btn.closest("#layout-mobile, #layout-desktop");
            const enroll = layout && layout.querySelector(".nav-enroll");
            if (!enroll) return;
            e.preventDefault();
            enroll.classList.remove("is-attention");
            void enroll.offsetWidth;
            enroll.classList.add("is-attention");
            enroll.focus({ preventScroll: true });
            clearTimeout(enroll._attentionTimer);
            enroll._attentionTimer = setTimeout(() => enroll.classList.remove("is-attention"), 2000);
        });
    });

    var FAB_WA_PHONE = "923293412618";
    var FAB_WA_DEFAULT =
      "Hi, I'd like to know more about the AI Web Crafts e-commerce mentorship (Rs. 4,500).";

    function pushWhatsAppFabAnalytics(leadType) {
      var leadUniqueId = "lead_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: leadType === "whatsapp_fab_send" ? "whatsapp_send" : "whatsapp_click",
        eventId: leadUniqueId,
        lead_type: leadType
      });
      if (leadType === "whatsapp_fab_send") {
        window.dataLayer.push({
          event: "generate_lead",
          eventId: leadUniqueId,
          lead_source: "whatsapp_fab"
        });
        if (typeof fbq === "function") {
          fbq(
            "track",
            "Lead",
            {
              content_name: "Ecom Mentorship - WhatsApp FAB",
              currency: "PKR",
              value: 4500
            },
            { eventID: leadUniqueId }
          );
        }
      }
    }

    (function initFabWhatsAppChat() {
      var panel = document.getElementById("fabWaPanel");
      var toggle = document.getElementById("fabWaToggle");
      var closeBtn = document.getElementById("fabWaClose");
      var sendBtn = document.getElementById("fabWaSend");
      var messageEl = document.getElementById("fabWaMessage");
      if (!panel || !toggle || !sendBtn || !messageEl) return;

      function setPanelOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        if (open) {
          pushWhatsAppFabAnalytics("whatsapp_fab_open");
          window.setTimeout(function () {
            messageEl.focus();
            messageEl.setSelectionRange(messageEl.value.length, messageEl.value.length);
          }, 80);
        }
      }

      function isPanelOpen() {
        return !panel.hidden;
      }

      toggle.addEventListener("click", function () {
        setPanelOpen(!isPanelOpen());
      });

      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          setPanelOpen(false);
          toggle.focus();
        });
      }

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && isPanelOpen()) {
          setPanelOpen(false);
          toggle.focus();
        }
      });

      document.addEventListener("click", function (e) {
        if (!isPanelOpen()) return;
        var wrap = toggle.closest(".fab-wa-wrap");
        if (wrap && !wrap.contains(e.target)) {
          setPanelOpen(false);
        }
      });

      function openWhatsAppWithMessage() {
        var text = (messageEl.value || "").trim();
        if (!text) {
          messageEl.focus();
          return;
        }
        pushWhatsAppFabAnalytics("whatsapp_fab_send");
        var url =
          "https://wa.me/" + FAB_WA_PHONE + "?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener,noreferrer");
        setPanelOpen(false);
      }

      sendBtn.addEventListener("click", openWhatsAppWithMessage);

      messageEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          openWhatsAppWithMessage();
        }
      });

      if (!messageEl.value.trim()) {
        messageEl.value = FAB_WA_DEFAULT;
      }
    })();
